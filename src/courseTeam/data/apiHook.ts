import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addTeamMember, getRoles, getTeamMembers, removeTeamMember } from '@src/courseTeam/data/api';
import { courseTeamQueryKeys } from '@src/courseTeam/data/queryKeys';
import { AddTeamMemberParams, CourseTeamMemberQueryParams } from '@src/courseTeam/types';

export const useTeamMembers = (courseId: string, params: CourseTeamMemberQueryParams) => (
  useQuery({
    queryKey: courseTeamQueryKeys.byCoursePaginated(courseId, params),
    queryFn: () => getTeamMembers(courseId, params),
    enabled: !!courseId,
  })
);

export const useRoles = (courseId: string, editableRoles = false) => (
  useQuery({
    queryKey: courseTeamQueryKeys.roles(courseId, editableRoles),
    queryFn: () => getRoles(courseId, editableRoles),
    enabled: !!courseId,
  })
);

export const useAddTeamMember = (courseId: string) => {
  const queryClient = useQueryClient();
  return (useMutation({
    mutationFn: (params: AddTeamMemberParams) => addTeamMember(courseId, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseTeamQueryKeys.byCourse(courseId) });
    }
  })
  );
};

export const useRemoveTeamMember = (courseId: string) => {
  const queryClient = useQueryClient();
  return (useMutation({
    mutationFn: ({ identifier, roles }: { identifier: string; roles: string[] }) => removeTeamMember(courseId, identifier, roles),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseTeamQueryKeys.byCourse(courseId) });
    }
  })
  );
};
