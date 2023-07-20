import { useCallback, useEffect, useState } from "react";

import { DownloadCloud, Loader, MoveLeft, Printer } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

import ErrorAlert from "@/components/ErrorAlert";
import InputField from "@/components/InputField";
import PageHeader from "@/components/PageHeader";
import SelectField from "@/components/SelectField";
import { Button } from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { teamSchema, TeamSchemaType } from "@/lib/formValidation/addTeam";
import { downloadQRCode, printQRCode } from "@/lib/helpers";
import { getEmployeeOptions } from "@/services/employeesService";
import { getTeamsById } from "@/services/teamsService";
import { supabase } from "@/supabaseClient";
import { BreadCrumbProps } from "@/types/Breadcrumb";
import { OptionProps } from "@/types/options";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";

const AddTeam = () => {
  const { teamID } = useParams();

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [employeeOptions, setEmployeeOptions] = useState<OptionProps[]>([]);

  // Fetch team data by ID
  const { data: teamData, isError } = useQuery({
    enabled: !!teamID,
    queryKey: ["team", teamID],
    queryFn: () => getTeamsById(Number(teamID)),
  });

  // Fetch the team options from the API
  useQuery(["employee-options"], () => getEmployeeOptions(), {
    onSuccess: (data) => {
      if (data) {
        const options: OptionProps[] = data.map(
          ({ first_name, middle_name, last_name }) => {
            return {
              value: `${first_name} ${middle_name || ""} ${last_name}`,
              label: `${first_name} ${middle_name || ""} ${last_name}`,
            };
          }
        );
        setEmployeeOptions(options);
      }
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FieldValues, TeamSchemaType>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      team_name: "",
      team_password: "",
      team_members: "",
      billable_hours: "",
    },
  });

  const teamName = watch("team_name") as string;
  const teamPassword = watch("team_password") as string;
  const teamMembers = watch("team_members") as string;

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

  useEffect(() => {
    if (teamData) {
      setCustomValue("team_name", teamData.team_name);
      setCustomValue("team_password", teamData.team_password);
      setCustomValue("team_members", teamData.team_members);
      setCustomValue("billable_hours", String(teamData.billable_hours));
    }
  }, [teamData, setCustomValue]);

  // Check if team name and team password is available
  const hasTeamNameAndTeamPassword = !teamName || !teamPassword;

  // Set QR code value
  const qrCodeValue = hasTeamNameAndTeamPassword
    ? undefined
    : `
    Team Name: ${teamName}
    Team Password: ${teamPassword}
  `;

  // Function for create team
  const createTeam = async (data: FieldValues) => {
    setIsLoading(true);

    try {
      const { data: teamData, error } = await supabase
        .from("teams")
        .insert({ ...data, qr_code: qrCodeValue })
        .select();

      if (error) {
        throw error;
      }

      if (teamData) {
        toast.success("Team created successfully.");
        reset();
        setIsLoading(false);
        navigate("/");
      }
    } catch (error) {
      toast.error("Oops! Something went wrong when adding team");
      setIsLoading(false);
    }
  };

  // Function for update team
  const updateTeam = async (data: FieldValues) => {
    setIsLoading(true);

    try {
      const { data: teamData, error } = await supabase
        .from("teams")
        .update(data)
        .eq("id", teamID)
        .select();

      if (error) {
        throw error;
      }

      if (teamData) {
        toast.success("Updated successfully.");
        reset();
        setIsLoading(false);
        navigate("/");
      }
    } catch (error) {
      toast.error("Oops! Something went wrong");
      setIsLoading(false);
    }
  };

  // Form submission handler function
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    return teamID ? await updateTeam(data) : await createTeam(data);
  };

  const breadCrumbItems: BreadCrumbProps["items"] = [
    {
      path: "/",
      name: "Teams",
    },
    {
      path: "/add",
      name: `${teamID ? "Edit" : "Add"} Team`,
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
          pageTitle={`${teamID ? "Edit" : "Add"} Team`}
          items={breadCrumbItems}
        />

        <h2 className="mb-6 text-base font-medium">Basic Information</h2>
        <div className="grid items-start gap-6 mb-6 md:grid-cols-2 lg:grid-cols-3">
          <InputField
            type="text"
            id="team_name"
            label="Team Name"
            placeholder="Enter team name"
            register={register}
            errors={errors}
            required
          />

          <InputField
            type="text"
            id="team_password"
            label="Team Password"
            placeholder="Enter team password"
            register={register}
            errors={errors}
            required
          />
        </div>

        <h2 className="mb-4 text-base font-medium">Members</h2>
        <div className="grid items-start gap-6 mb-6 md:grid-cols-2 lg:grid-cols-3">
          <SelectField
            id="team_members"
            label="Team Members"
            value={teamMembers}
            defaultValue={teamData?.team_members || undefined}
            onChange={(value) => setCustomValue("team_members", value)}
            options={employeeOptions}
            register={register}
            errors={errors}
            placeHolder="Choose Team"
          />
        </div>

        <div className="grid items-start gap-6 mb-6 md:grid-cols-2 lg:grid-cols-3">
          <InputField
            type="text"
            id="billable_hours"
            label="Billable Hours"
            placeholder="Enter billable hours"
            register={register}
            errors={errors}
          />
        </div>

        <h2 className="mb-6 text-base font-medium">Team QR</h2>
        <div className="flex items-center justify-start gap-4 mb-6">
          <div className="w-28 p-1.5 border rounded-xl border-border">
            <QRCodeCanvas
              id="qrcode-canvas"
              value={qrCodeValue as string}
              className="!w-full !h-full"
            />
          </div>

          <div className="grid items-start gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-[13px] h-8 px-2 shadow-sm"
              onClick={() =>
                hasTeamNameAndTeamPassword
                  ? undefined
                  : downloadQRCode(teamName)
              }
              disabled={hasTeamNameAndTeamPassword}
            >
              <DownloadCloud size={16} className="mr-2 text-muted-foreground" />{" "}
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-[13px] h-8 px-2 shadow-sm"
              onClick={hasTeamNameAndTeamPassword ? undefined : printQRCode}
              disabled={hasTeamNameAndTeamPassword}
            >
              <Printer size={16} className="mr-2 text-muted-foreground" /> Print
            </Button>
          </div>
        </div>
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
              {teamID ? "Save" : "Create"}
            </Button>
          </div>
        </Container>
      </div>
    </>
  );
};

export default AddTeam;
