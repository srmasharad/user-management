import { ChangeEvent, useCallback, useEffect, useState } from "react";

import { Loader, MoveLeft } from "lucide-react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

import ErrorAlert from "@/components/ErrorAlert";
import InputField from "@/components/InputField";
import PageHeader from "@/components/PageHeader";
import SelectField from "@/components/SelectField";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import Container from "@/components/ui/Container";
import DatePicker from "@/components/ui/DatePicker";
import UploadProfile from "@/components/UploadProfile";
import { useCustomDatePicker } from "@/hooks/useCustomDatePicker";
import { employeeSchema, EmployeeSchemaType } from "@/lib/formValidation";
import { FILE_SIZE, IMAGE_TYPES } from "@/lib/helpers";
import { formatDate } from "@/lib/utils";
import { getEmployeesById } from "@/services/employeesService";
import { getTeamOptions } from "@/services/teamsService";
import { supabase } from "@/supabaseClient";
import { BreadCrumbProps } from "@/types/Breadcrumb";
import { OptionProps } from "@/types/options";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";

import profilePlaceholder from "../../assets/profile-placeholder.png";

const genderOptions: OptionProps[] = [
  {
    value: "Male",
    label: "Male",
  },
  {
    value: "Female",
    label: "Female",
  },
  {
    value: "Others",
    label: "Others",
  },
];

interface CustomError extends Error {
  message: string;
}

const AddEmployee = () => {
  const { empID } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [hasImageUploaded, setHasImageUploaded] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [teamOptions, setTeamOptions] = useState<OptionProps[]>([]);

  // Fetch employee data by ID
  const { data: empData, isError } = useQuery({
    enabled: !!empID,
    queryKey: ["employee", empID],
    queryFn: () => getEmployeesById(Number(empID)),
  });

  // Fetch the team options from the API
  useQuery(["team-options"], () => getTeamOptions(), {
    onSuccess: (data) => {
      if (data) {
        const options: OptionProps[] = data.map(({ id, team_name }) => {
          return {
            value: String(id),
            label: team_name,
          };
        });
        setTeamOptions(options);
      }
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm<FieldValues, EmployeeSchemaType>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      first_name: "",
      middle_name: "",
      avatar: "",
      last_name: "",
      dob: "",
      gender: "",
      address: "",
      phone: "",
      email: "",
      start_at: "",
      ends_in: "",
      job_position: "",
      team: "",
      billable_hours: "",
    },
  });

  const watchDob = watch("dob") as Date;
  const gender = watch("gender") as string;
  const team = watch("team") as string;
  const isBillable = watch("isBillable", true) as boolean;

  const setCustomValue = useCallback(
    (id: string, value: any) => {
      setValue(id, value, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    },
    [setValue]
  );

  // Custom date picker hook to convert text to date format and place to calendar
  const { customDate, setCustomDate, onCustomDateChange } =
    useCustomDatePicker(setCustomValue);

  useEffect(() => {
    if (empData) {
      setAvatarUrl(empData.avatar);
      setCustomDate(formatDate(new Date(empData.dob)));

      setCustomValue("avatar", [empData.avatar]);
      setCustomValue("first_name", empData.first_name);
      setCustomValue("middle_name", empData.middle_name);
      setCustomValue("last_name", empData.last_name);
      setCustomValue("dob", new Date(empData.dob));
      setCustomValue("gender", empData.gender);
      setCustomValue("address", empData.address);
      setCustomValue("phone", empData.phone);
      setCustomValue("email", empData.email);
      setCustomValue("job_position", empData.job_position);
      setCustomValue(
        "team",
        empData.team === null ? "" : String(empData.team.id)
      );
      setCustomValue("start_at", empData.start_at);
      setCustomValue("ends_in", empData.ends_in);
      setCustomValue(
        "isBillable",
        String(empData.billable_hours) ? true : false
      );
      setCustomValue("billable_hours", String(empData.billable_hours));
    }
  }, [empData, setCustomValue, setCustomDate]);

  // Upload the profile picture to 'avatars' bucket in supabase storage
  const uploadAvatar = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      try {
        setIsImageUploading(true);

        // Throw error if file did't exit or file length is 0
        if (!event.target.files || event.target.files.length === 0) {
          const error: CustomError = new Error(
            "You must select an image to upload."
          );
          throw error;
        }

        const file = event.target.files[0];

        if (file.size > FILE_SIZE) {
          const error: CustomError = new Error("Max file size is 1MB.");
          throw error;
        }

        if (!IMAGE_TYPES.includes(file.type)) {
          const error: CustomError = new Error("Unsupported file format");
          throw error;
        }

        // Create a random name for the file
        const fileExt = file?.name?.split(".").pop();
        const fileName = `${Math.random()}.${fileExt as string}`;
        const filePath = `${fileName}`;

        // Upload the profile picture to 'avatars' bucket
        const { error } = await supabase.storage
          .from("avatars")
          .upload(filePath, file, {
            upsert: false,
          });

        if (error) {
          throw error;
        }

        // Get the avatar url after uploaded to 'avatars' bucket
        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(filePath);

        toast.success("Profile image successfully uploaded.");
        setHasImageUploaded(true);
        setAvatarUrl(publicUrl);
        setIsImageUploading(false);
      } catch (error: any) {
        if (error instanceof Error && "message" in error) {
          if (error.message === "You must select an image to upload.") {
            setError("avatar", { message: error.message });
          } else if (error.message === "Max file size is 1MB.") {
            setError("avatar", { message: error.message });
          } else if (error.message === "Unsupported file format") {
            setError("avatar", { message: error.message });
          } else {
            alert(error.message); // Generic error alert
          }
        } else {
          toast.error("Oops! Something went wrong.");
        }

        setHasImageUploaded(false);
        setIsImageUploading(false);
        setAvatarUrl("");
      }
    },
    [setError]
  );

  // Function for create employee
  const createEmployee = async (data: FieldValues) => {
    setIsLoading(true);

    try {
      const { data: empData, error } = await supabase
        .from("employees")
        .insert({ ...data, avatar: avatarUrl, team: Number(team) || null })
        .select();

      if (error) {
        throw error;
      }

      if (empData) {
        toast.success("Employee created successfully.");
        reset();
        setAvatarUrl("");
        setIsLoading(false);
        setHasImageUploaded(false);
        setCustomDate("");
        navigate("/employees");
      }
    } catch (error) {
      toast.error("Oops! Something went wrong when adding employee");
      setIsLoading(false);
    }
  };

  // Function for update employee
  const updateEmployee = async (data: FieldValues) => {
    setIsLoading(true);

    try {
      const { data: empData, error } = await supabase
        .from("employees")
        .update({ ...data, avatar: avatarUrl, team: Number(team) || null })
        .eq("id", empID)
        .select();

      if (error) {
        throw error;
      }

      if (empData) {
        toast.success("Updated successfully.");
        reset();
        setAvatarUrl("");
        setIsLoading(false);
        setHasImageUploaded(false);
        setCustomDate("");
        navigate("/employees");
      }
    } catch (error) {
      toast.error("Oops! Something went wrong");
      setIsLoading(false);
    }
  };

  // Form submission handler function
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    return empID ? await updateEmployee(data) : await createEmployee(data);
  };

  const breadCrumbItems: BreadCrumbProps["items"] = [
    {
      path: "/employees",
      name: "Employees",
    },
    {
      path: "/employees/add",
      name: `${empID ? "Edit" : "Add"} Employee`,
      isCurrent: true,
    },
  ];

  if (isError) {
    return <ErrorAlert />;
  }

  return (
    <>
      <Container className="pb-20">
        <PageHeader
          pageTitle={`${empID ? "Edit" : "Add"} Employee`}
          items={breadCrumbItems}
        />

        <UploadProfile
          id="avatar"
          label="Profile Picture"
          isUploading={isImageUploading}
          hasUploaded={hasImageUploaded}
          avatarUrl={avatarUrl}
          onChange={
            uploadAvatar as (event: ChangeEvent<HTMLInputElement>) => void
          }
          register={register}
          errors={errors}
          placeholder={profilePlaceholder}
          required
        />
        <h2 className="mb-6 text-base font-medium">Basic Information</h2>
        <div className="grid items-start gap-6 mb-6 md:grid-cols-2 lg:grid-cols-3">
          <InputField
            type="text"
            id="first_name"
            label="First Name"
            placeholder="Enter first name"
            register={register}
            errors={errors}
            required
          />

          <InputField
            type="text"
            id="middle_name"
            label="Middle Name"
            placeholder="Enter middle name"
            register={register}
            errors={errors}
          />

          <InputField
            type="text"
            id="last_name"
            label="Last Name"
            placeholder="Enter last name"
            register={register}
            errors={errors}
          />

          <DatePicker
            label="Date of birth"
            onSetDate={(value) => setCustomValue("dob", value)}
            date={watchDob}
            id="dob"
            register={register}
            errors={errors}
            customDate={customDate}
            setCustomDate={setCustomDate}
            onCustomDateChange={onCustomDateChange}
          />

          <SelectField
            id="gender"
            label="Gender"
            value={gender}
            defaultValue={empID ? gender : undefined}
            onChange={(value) => setCustomValue("gender", value)}
            options={genderOptions}
            register={register}
            errors={errors}
            placeHolder="Choose Gender"
          />

          <InputField
            type="text"
            id="address"
            label="Address"
            placeholder="Enter address"
            register={register}
            errors={errors}
          />

          <InputField
            type="text"
            id="phone"
            label="Phone"
            placeholder="Enter phone number"
            register={register}
            errors={errors}
          />

          <InputField
            type="email"
            id="email"
            label="Email Address"
            placeholder="Enter email address"
            register={register}
            errors={errors}
          />
        </div>
        <h2 className="mb-6 text-base font-medium">Working Hours</h2>
        <div className="grid items-start gap-6 mb-6 md:grid-cols-2 lg:grid-cols-3">
          <InputField
            type="text"
            id="start_at"
            label="Start At"
            placeholder="HH:MM"
            register={register}
            errors={errors}
          />

          <InputField
            type="text"
            id="ends_in"
            label="Ends In"
            placeholder="HH:MM"
            register={register}
            errors={errors}
          />
        </div>
        <h2 className="mb-6 text-base font-medium">Jobs</h2>
        <div className="grid items-start gap-6 mb-6 md:grid-cols-2 lg:grid-cols-3">
          <InputField
            type="text"
            id="job_position"
            label="Job Position"
            placeholder="Enter job position"
            register={register}
            errors={errors}
          />

          <SelectField
            id="team"
            label="Team"
            value={team}
            defaultValue={
              empID && empData?.team !== null
                ? String(empData?.team.id)
                : undefined
            }
            onChange={(value) => setCustomValue("team", String(value))}
            options={teamOptions}
            register={register}
            errors={errors}
            placeHolder="Choose Team"
          />
        </div>
        <h2 className="mb-6 text-base font-medium">Billable Information</h2>
        <div className="flex items-center mb-6 space-x-2">
          <Checkbox
            id="isBillable"
            {...register("isBillable")}
            onCheckedChange={(e) => setCustomValue("isBillable", e)}
            checked={isBillable}
          />
          <label
            htmlFor="isBillable"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            This user is billable
          </label>
        </div>
        {isBillable && (
          <div className="grid items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
            <InputField
              type="text"
              id="billable_hours"
              label="Billable Hours"
              placeholder="Enter billable hours"
              register={register}
              errors={errors}
            />
          </div>
        )}
      </Container>

      <div className="fixed bottom-0 left-0 z-10 w-full p-4 bg-white border-[1px]">
        <Container className="my-0">
          <div className="flex items-center justify-start">
            <Button
              className="min-w-[120px] mr-4"
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              <MoveLeft
                size={20}
                strokeWidth={1.75}
                className="mr-2.5 text-muted-foreground"
              />{" "}
              Back
            </Button>
            <Button
              className="min-w-[120px]"
              disabled={isLoading}
              onClick={handleSubmit(onSubmit) as SubmitHandler<FieldValues>}
            >
              {isLoading && <Loader size={16} className="mr-2 animate-spin" />}
              {empID ? "Save" : "Create"}
            </Button>
          </div>
        </Container>
      </div>
    </>
  );
};

export default AddEmployee;
