import { useCallback, useState } from "react";

import { Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import DeleteModal from "@/components/DeleteModal";
import EmployeeDetailSheet from "@/components/EmployeeDetailSheet";
import ErrorAlert from "@/components/ErrorAlert";
import SearchInputField from "@/components/SearchInputField";
import { Button } from "@/components/ui/Button";
import {
  getAllEmployees,
  getEmployeesById,
  getSearchEmployees,
} from "@/services/employeesService";
import { supabase } from "@/supabaseClient";
import { EmployeesSchema } from "@/types/schema/employees";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import EmployeesTable from "./EmployeesTable";

const Employees = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [rowId, setRowId] = useState<number | null>();
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);

  // Get the list of all teams from supabase
  const {
    data: empData,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: () => getAllEmployees(),
  });

  // Fetch employee data by ID
  const {
    data: empSingleData,
    isLoading: isEmpDetailLoading,
    isSuccess: isEmpDetailSuccess,
  } = useQuery({
    enabled: !!rowId,
    queryKey: ["employee", rowId],
    queryFn: () => getEmployeesById(Number(rowId)),
  });

  // Delete the team list from the table
  const onDeleteEmployees = useCallback(async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("employees")
        .delete()
        .eq("id", rowId);

      if (error) {
        throw new Error(error.message);
      }

      toast.success("Deleted successfully.");
      setIsDeleting(false);
      setRowId(null);
      setDeleteModal(false);
      await queryClient.invalidateQueries(["employees"]);
    } catch (error) {
      toast.error("Oops! Something went wrong");
      setIsDeleting(false);
    }
  }, [queryClient, rowId]);

  /**
   * Function for handling the delete action for a single item
   * @param id - The unique identifier of the item to be deleted (number)
   */
  const handleSingleDelete = (id: number) => {
    setDeleteModal(true); // Set the delete modal state to true to show the confirmation modal/dialog
    setRowId(id); // Set the row ID to the specified ID to identify the item to be deleted
  };

  // Function for handling the closing of the delete modal
  const handleCloseModal = () => {
    if (!isDeleting) {
      setDeleteModal(false); // Set the delete modal state to false to close the modal
      setRowId(null); // Reset the row ID to null
    }
  };

  const onHandleSearch = useCallback(
    async (query: string) => {
      await queryClient.prefetchQuery({
        queryKey: ["employees"],
        queryFn: () => getSearchEmployees(query),
      });
    },
    [queryClient]
  );

  const onHandleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value;
      if (!value) {
        onHandleSearch("").catch((error) => {
          console.log(error);
        });
      } else {
        setSearchQuery(value);
      }
    },
    [onHandleSearch]
  );

  const onHandleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        setIsSearching(true);

        onHandleSearch(searchQuery)
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {
            setIsSearching(false);
          });
      }
    },
    [onHandleSearch, searchQuery]
  );

  /**
   * Function for handling the get action for a single employee
   * @param id - The unique identifier of the employee to be received (number)
   */
  const handleSingleEmp = (id: number) => {
    setSheetOpen(true); // Set the sheet state to true to show the confirmation modal/dialog
    setRowId(id); // Set the row ID to the specified ID to identify the employee to be received
  };

  // Function for handling the closing of the sheet
  const handleCloseSheet = () => {
    setSheetOpen(false); // Set the sheet state to false to close the sheet
    setTimeout(() => {
      setRowId(null); // Reset the row ID to null
    }, 100);
  };

  // const empDetail = (empSingleData as EmployeesSchema) ?? {};

  if (isError) {
    return <ErrorAlert />;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <SearchInputField
          name="searchTeam"
          placeholder="Search employee"
          onChange={(event) => onHandleSearchChange(event)}
          onKeyDown={(event) => onHandleSearchKeyDown(event)}
          isSearching={isSearching}
        />

        <Button onClick={() => navigate("add")}>
          <Plus className="w-5 h-5 mr-2" /> Add Employee
        </Button>
      </div>

      <EmployeesTable
        data={empData as EmployeesSchema[]}
        onDelete={handleSingleDelete}
        isLoading={isLoading}
        isSuccess={isSuccess}
        onSheetOpen={handleSingleEmp}
      />

      <EmployeeDetailSheet
        data={empSingleData as EmployeesSchema}
        onOpen={sheetOpen}
        onClose={handleCloseSheet}
        employeeId={Number(rowId)}
        isLoading={isEmpDetailLoading}
        isSuccess={isEmpDetailSuccess}
      />

      <DeleteModal
        open={deleteModal}
        onClose={handleCloseModal}
        onDelete={onDeleteEmployees}
        isDeleting={isDeleting}
        title="Are you absolutely sure?"
      >
        This action cannot be undone. This will permanently delete your item and
        remove your data from our servers.
      </DeleteModal>
    </>
  );
};

export default Employees;
