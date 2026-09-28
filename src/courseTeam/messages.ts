import { defineMessages } from '@openedx/frontend-base';

const messages = defineMessages({
  courseTeamTitle: {
    id: 'instruct.courseTeam.page.title',
    defaultMessage: 'Course Team Management',
    description: 'Title for the course team page',
  },
  addTeamMember: {
    id: 'instruct.courseTeam.addTeamMember',
    defaultMessage: 'Add Team Member',
    description: 'Button label for adding a team member',
  },
  membersTab: {
    id: 'instruct.courseTeam.membersTab',
    defaultMessage: 'Members',
    description: 'Tab title for course team members',
  },
  rolesTab: {
    id: 'instruct.courseTeam.rolesTab',
    defaultMessage: 'Roles',
    description: 'Tab title for course team roles',
  },
  username: {
    id: 'instruct.courseTeam.username',
    defaultMessage: 'Username',
    description: 'Column header for team member username',
  },
  email: {
    id: 'instruct.courseTeam.email',
    defaultMessage: 'Email',
    description: 'Column header for team member email',
  },
  role: {
    id: 'instruct.courseTeam.role',
    defaultMessage: 'Role',
    description: 'Column header for team member role',
  },
  actions: {
    id: 'instruct.courseTeam.actions',
    defaultMessage: 'Actions',
    description: 'Column header for team member actions',
  },
  edit: {
    id: 'instruct.courseTeam.edit',
    defaultMessage: 'Edit',
    description: 'Button label for editing a team member',
  },
  noTeamMembers: {
    id: 'instruct.courseTeam.noTeamMembers',
    defaultMessage: 'No team members found.',
    description: 'Message displayed when there are no team members',
  },
  allRoles: {
    id: 'instruct.courseTeam.allRoles',
    defaultMessage: 'All Roles',
    description: 'Option label for filtering by all roles',
  },
  staff: {
    id: 'instruct.courseTeam.roles.staff',
    defaultMessage: 'Staff',
    description: 'Role name for staff members',
  },
  staffDescription: {
    id: 'instruct.courseTeam.roles.staffDescription',
    defaultMessage: 'Course team members with the Staff role help you manage your course. Staff can enroll and unenroll learners, as well as modify their grades and access all course data. Staff also have access to your course in Studio and Insights. Any users not yet enrolled in the course will be automatically enrolled when added as Staff.',
    description: 'Description for staff role',
  },
  limitedStaff: {
    id: 'instruct.courseTeam.roles.limitedStaff',
    defaultMessage: 'Limited Staff',
    description: 'Role name for limited staff members',
  },
  limitedStaffDescription: {
    id: 'instruct.courseTeam.roles.limitedStaffDescription',
    defaultMessage: 'Course team members with the Limited Staff role help you manage your course. Limited Staff can enroll and unenroll learners, as well as modify their grades and access all course data. Limited Staff don\'t have access to your course in Studio. Any users not yet enrolled in the course will be automatically enrolled when added as Limited Staff.',
    description: 'Description for limited staff role',
  },
  admin: {
    id: 'instruct.courseTeam.roles.admin',
    defaultMessage: 'Admin',
    description: 'Role name for admin members',
  },
  adminDescription: {
    id: 'instruct.courseTeam.roles.adminDescription',
    defaultMessage: 'Course team members with the Admin role help you manage your course. They can do all of the tasks that Staff can do, and can also add and remove the Staff and Admin roles, discussion moderation roles, and the beta tester role to manage course team membership. Any users not yet enrolled in the course will be automatically enrolled when added as Admin.',
    description: 'Description for admin role',
  },
  beta: {
    id: 'instruct.courseTeam.roles.beta',
    defaultMessage: 'Beta Testers',
    description: 'Role name for beta tester members',
  },
  betaDescription: {
    id: 'instruct.courseTeam.roles.betaDescription',
    defaultMessage: 'Beta Testers can see course content before other learners. They can make sure that the content works, but have no additional privileges. Any users not yet enrolled in the course will be automatically enrolled when added as Beta Tester.',
    description: 'Description for beta tester role',
  },
  courseDataResearchers: {
    id: 'instruct.courseTeam.roles.courseDataResearchers',
    defaultMessage: 'Course Data Researchers',
    description: 'Role name for course data researcher members',
  },
  courseDataResearchersDescription: {
    id: 'instruct.courseTeam.roles.courseDataResearchersDescription',
    defaultMessage: 'Course Data Researchers can access the data download tab. Any users not yet enrolled in the course will be automatically enrolled when added as Course Data Researcher.',
    description: 'Description for course data researcher role',
  },
  discussionAdmin: {
    id: 'instruct.courseTeam.roles.discussionAdmin',
    defaultMessage: 'Discussion Admin',
    description: 'Role name for discussion admin members',
  },
  discussionAdminDescription: {
    id: 'instruct.courseTeam.roles.discussionAdminDescription',
    defaultMessage: 'Discussion Admins can edit or delete any post, clear misuse flags, close and re-open threads, endorse responses, and see posts from all groups. Their posts are marked as \'staff\'. They can also add and remove the discussion moderation roles to manage course team membership. Any users not yet enrolled in the course will be automatically enrolled when added as Discussion Admin.',
    description: 'Description for discussion admin role',
  },
  discussionModerator: {
    id: 'instruct.courseTeam.roles.discussionModerator',
    defaultMessage: 'Discussion Moderator',
    description: 'Role name for discussion moderator members',
  },
  discussionModeratorDescription: {
    id: 'instruct.courseTeam.roles.discussionModeratorDescription',
    defaultMessage: 'Discussion Moderators can edit or delete any post, clear misuse flags, close and re-open threads, endorse responses, and see posts from all groups. Their posts are marked as \'staff\'. They cannot manage course team membership by adding or removing discussion moderation roles. Any users not yet enrolled in the course will be automatically enrolled when added as Discussion Moderator.',
    description: 'Description for discussion moderator role',
  },
  groupCommunityTA: {
    id: 'instruct.courseTeam.roles.groupCommunityTA',
    defaultMessage: 'Group Community TA',
    description: 'Role name for group community TA members',
  },
  groupCommunityTADescription: {
    id: 'instruct.courseTeam.roles.groupCommunityTADescription',
    defaultMessage: 'Group Community TAs are members of the community who help course teams moderate discussions. Group Community TAs see only posts by learners in their assigned group. They can edit or delete posts, clear flags, close and re-open threads, and endorse responses, but only for posts by learners in their group. Their posts are marked as \'Community TA\'. Any users not yet enrolled in the course will be automatically enrolled when added as Group Community TA.',
    description: 'Description for group community TA role',
  },
  communityTA: {
    id: 'instruct.courseTeam.roles.communityTA',
    defaultMessage: 'Community TA',
    description: 'Role name for community TA members',
  },
  communityTADescription: {
    id: 'instruct.courseTeam.roles.communityTADescription',
    defaultMessage: 'Community TAs are members of the community who help course teams moderate discussions. They can see posts by learners in their assigned cohort or enrollment track, and can edit or delete posts, clear flags, close or re-open threads, and endorse responses. Their posts are marked as \'Community TA\'. Any users not yet enrolled in the course will be automatically enrolled when added as Community TA.',
    description: 'Description for community TA role',
  },
  ccxCoach: {
    id: 'instruct.courseTeam.roles.ccxCoach',
    defaultMessage: 'CCX Coach',
    description: 'Role name for CCX coach members',
  },
  ccxCoachDescription: {
    id: 'instruct.courseTeam.roles.ccxCoachDescription',
    defaultMessage: 'CCX Coaches are able to create their own Custom Courses based on this course, which they can use to provide personalized instruction to their own students based in this course material.',
    description: 'Description for CCX coach role',
  },
  addNewTeamMember: {
    id: 'instruct.courseTeam.addNewTeamMember',
    defaultMessage: 'Add New Team Member',
    description: 'Title for add new team member form',
  },
  addNewTeamMemberDescription: {
    id: 'instruct.courseTeam.addNewTeamMemberDescription',
    defaultMessage: 'Add new members to {courseName}’s Course team and assign them a role to define their permissions.',
    description: 'Description for add new team member form',
  },
  addUsersLabel: {
    id: 'instruct.courseTeam.addUsersLabel',
    defaultMessage: 'Add users by username or email',
    description: 'Label for input to add users to course team',
  },
  usersPlaceholder: {
    id: 'instruct.courseTeam.usersPlaceholder',
    defaultMessage: 'Enter one or more email addresses or usernames',
    description: 'Placeholder for input to add users to course team',
  },
  roleLabel: {
    id: 'instruct.courseTeam.roleLabel',
    defaultMessage: 'Role',
    description: 'Label for role selection when adding users to course team',
  },
  rolePlaceholder: {
    id: 'instruct.courseTeam.rolePlaceholder',
    defaultMessage: 'Select Role',
    description: 'Placeholder for role selection when adding users to course team',
  },
  cancelButton: {
    id: 'instruct.courseTeam.cancelButton',
    defaultMessage: 'Cancel',
    description: 'Label for cancel button when adding users to course team',
  },
  saveButton: {
    id: 'instruct.courseTeam.saveButton',
    defaultMessage: 'Save',
    description: 'Label for save button when adding users to course team',
  },
  addTeamMemberError: {
    id: 'instruct.courseTeam.addTeamMemberError',
    defaultMessage: 'Could not find a user with username or email address “{username}”',
    description: 'Error message displayed when adding a team member fails',
  },
  closeButton: {
    id: 'instruct.courseTeam.closeButton',
    defaultMessage: 'Close',
    description: 'Label for close button in error modal when adding a team member fails',
  },
  failedToAddTeamMembers: {
    id: 'instruct.courseTeam.failedToAddTeamMembers',
    defaultMessage: 'The following usernames and/or email addresses are invalid. All other roles have been added to the team members.',
    description: 'Error message displayed when some team members could not be added',
  },
  unknownLearner: {
    id: 'instruct.courseTeam.unknownLearner',
    defaultMessage: 'Unknown learner: {learner}',
    description: 'Displayed when a learner does not have a full name or username available',
  },
  inactiveTeamMembers: {
    id: 'instruct.courseTeam.inactiveTeamMembers',
    defaultMessage: 'The following accounts are inactive and were not given the role. They must activate their accounts first.',
    description: 'Error message displayed when team members could not be added because their accounts are inactive',
  },
  inactiveLearner: {
    id: 'instruct.courseTeam.inactiveLearner',
    defaultMessage: 'Inactive learner: {learner}',
    description: 'Displayed when a learner is inactive',
  },
  erroredTeamMembers: {
    id: 'instruct.courseTeam.erroredTeamMembers',
    defaultMessage: 'An error occurred while giving the role to the following users. Please try again.',
    description: 'Message displaying the users that could not be given a role because of an unexpected error',
  },
  editTeamTitle: {
    id: 'instruct.courseTeam.editTeamTitle',
    defaultMessage: 'Edit {username} Roles',
    description: 'Title for edit team member modal',
  },
  editInstructions: {
    id: 'instruct.courseTeam.editInstructions',
    defaultMessage: 'Uncheck to remove role from {username}',
    description: 'Instructions for editing a team member',
  },
  addRole: {
    id: 'instruct.courseTeam.addRole',
    defaultMessage: 'Add role',
    description: 'Label for adding a role to a team member',
  },
  removeTeamMemberError: {
    id: 'instruct.courseTeam.removeTeamMemberError',
    defaultMessage: 'Failed to remove one or more roles from {username}.',
    description: 'Error message displayed when removing a team member fails',
  },
  addRoleError: {
    id: 'instruct.courseTeam.addRoleError',
    defaultMessage: 'Failed to add role to {username}.',
    description: 'Error message displayed when adding a role to a team member fails',
  },
  viewStudioRoles: {
    id: 'instruct.courseTeam.viewStudioRoles',
    defaultMessage: 'View Studio Roles',
    description: 'Button label for viewing course team roles in Studio',
  },
  roleNotEditable: {
    id: 'instruct.courseTeam.roleNotEditable',
    defaultMessage: 'You do not have permission to change this role.',
    description: 'Tooltip message displayed when a role cannot be edited by the user',
  },
  cannotRemoveOwnRole: {
    id: 'instruct.courseTeam.cannotRemoveOwnRole',
    defaultMessage: 'Admins cannot remove their own admin access.',
    description: 'Tooltip message displayed when a user tries to remove their own admin role',
  }
});

export default messages;
