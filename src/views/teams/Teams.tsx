import { useCallback, useState } from "react";

import { Filter, Loader, Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import DeleteModal from "@/components/DeleteModal";
import ErrorAlert from "@/components/ErrorAlert";
import SearchInputField from "@/components/SearchInputField";
import { Button } from "@/components/ui/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { Slider } from "@/components/ui/Slider";
import {
  getAllTeams,
  getSearchByManHours,
  getSearchTeams,
} from "@/services/teamsService";
import { supabase } from "@/supabaseClient";
import { TeamsSchema } from "@/types/schema/teams";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import TeamsTable from "./TeamsTable";

// Filter man hours range
const minHourRange = 100;
const maxHourRange = 1000;

const Teams = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [deleteModal, setDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [rowId, setRowId] = useState<number | null>();
  const [hourRange, setHourRange] = useState<number[]>();
  const [isSearching, setIsSearching] = useState(false);
  const [isApplyingFilter, setIsApplyingFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Get the list of all teams from supabase
  const {
    data: teamsData,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["teams"],
    queryFn: () => getAllTeams(),
  });

  // Function to delete the team from database based on the 'id' (rowId) provided
  const onDeleteTeams = useCallback(async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase.from("teams").delete().eq("id", rowId);

      if (error) {
        throw new Error(error.message);
      }

      toast.success("Deleted successfully.");
      setIsDeleting(false);
      setRowId(null);
      setDeleteModal(false);
      await queryClient.invalidateQueries(["teams"]);
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
        queryKey: ["teams"],
        queryFn: () => getSearchTeams(query),
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

  // Function for search teams by man hours
  const onSearchByManHours = useCallback(
    async (value: number) => {
      await queryClient.prefetchQuery({
        queryKey: ["teams"],
        queryFn: () => getSearchByManHours(value),
      });
    },
    [queryClient]
  );

  // Function to clear the "Man Hours" filter by refetching all teams data from the API
  const onApplyManHours = useCallback(() => {
    if (hourRange) {
      setIsApplyingFilter(true);
      onSearchByManHours(hourRange[0])
        .catch((error) => console.log(error))
        .finally(() => {
          setIsApplyingFilter(false);
        });
    }
  }, [hourRange, onSearchByManHours]);

  // Function to reset filter of teams by man hours
  const onClearManHours = useCallback(async () => {
    await queryClient.prefetchQuery({
      queryKey: ["teams"],
      queryFn: () => getAllTeams(),
    });
  }, [queryClient]);

  // Function to handle the "Clear Filter" button click
  const handleFilterClear = () => {
    setHourRange([minHourRange]);
    onClearManHours().catch((error) => console.log(error));
  };

  // check if hour is not set in state to filter with man hours
  const isHourUndefined = hourRange === undefined;

  // check if hourRange value is equal to min hour range
  const isHourEqualToMinHourRange =
    hourRange && Number(hourRange[0]) === minHourRange;

  if (isError) {
    return <ErrorAlert />;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div className="flex justify-start items-center gap-2.5">
          <SearchInputField
            name="searchTeam"
            placeholder="Search employee"
            onChange={(event) => onHandleSearchChange(event)}
            onKeyDown={(event) => onHandleSearchKeyDown(event)}
            isSearching={isSearching}
          />

          <Popover>
            <PopoverTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 px-5 py-2.5">
              <Filter size={16} className="mr-2" /> Filter
            </PopoverTrigger>
            <PopoverContent align="start">
              <h3 className="mb-2 text-sm font-medium">Filter</h3>
              <p className="mb-3 text-sm font-medium text-muted-foreground">
                Choose man hour range
              </p>
              <div className="flex flex-col gap-3 mb-5">
                <Slider
                  value={hourRange}
                  currentValue={hourRange}
                  min={minHourRange}
                  max={maxHourRange}
                  step={10}
                  onValueChange={(value) => setHourRange(value)}
                />
                <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                  <span>{minHourRange.toLocaleString()} hours</span>
                  <span>{maxHourRange.toLocaleString()} hours</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="px-6"
                  onClick={
                    isHourUndefined || isHourEqualToMinHourRange
                      ? undefined
                      : isApplyingFilter
                      ? undefined
                      : onApplyManHours
                  }
                  disabled={
                    isHourUndefined ||
                    isHourEqualToMinHourRange ||
                    isApplyingFilter
                  }
                >
                  {isApplyingFilter && (
                    <Loader
                      size={16}
                      className="mr-2 text-slate-400 animate-spin"
                    />
                  )}
                  Apply
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={
                    !isHourEqualToMinHourRange ? handleFilterClear : undefined
                  }
                >
                  Clear Filter
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Button onClick={() => navigate("add")}>
          <Plus className="w-5 h-5 mr-2" /> Add Team
        </Button>
      </div>

      <TeamsTable
        data={teamsData as TeamsSchema[]}
        onDelete={handleSingleDelete}
        isLoading={isLoading}
        isSuccess={isSuccess}
      />

      <DeleteModal
        open={deleteModal}
        onClose={handleCloseModal}
        onDelete={onDeleteTeams}
        isDeleting={isDeleting}
        title="Are you absolutely sure?"
      >
        This action cannot be undone. This will permanently delete your item and
        remove your data from our servers.
      </DeleteModal>
    </>
  );
};

export default Teams;
