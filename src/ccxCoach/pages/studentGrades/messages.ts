import { defineMessages } from '@openedx/frontend-base';

const messages = defineMessages({
  studentGradesPageTitle: {
    id: 'ccxCoach.studentGrades.pageTitle',
    defaultMessage: 'Student Grades',
    description: 'Title for the Student Grades tab in the CCX Coach dashboard',
  },
  viewGradebookButton: {
    id: 'ccxCoach.studentGrades.viewGradebookButton',
    defaultMessage: 'View Gradebook',
    description: 'Label for the button that opens the Gradebook MFE slot',
  },
  downloadStudentGradesTitle: {
    id: 'ccxCoach.studentGrades.downloadStudentGradesTitle',
    defaultMessage: 'Download Student Grades',
    description: 'Title for the download student grades action card',
  },
  downloadStudentGradesDescription: {
    id: 'ccxCoach.studentGrades.downloadStudentGradesDescription',
    defaultMessage: 'Click to generate a CSV grade report for all students',
    description: 'Description for the download student grades action card',
  },
  downloadStudentGradesButton: {
    id: 'ccxCoach.studentGrades.downloadStudentGradesButton',
    defaultMessage: 'Download Student Grades',
    description: 'Label for the button that triggers the student grades CSV download',
  },
});

export default messages;
