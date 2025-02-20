import { ActiveApplicantsDataProps } from "../types/type";

export const ActiveApplicantsData: ActiveApplicantsDataProps[] = [
    
        {
            id: 1,
            aaplicantsName: "John Doe",
            technology: "React.js",
            operation: {
                edit: "Edit",
                view: "View",
                delete: "Delete"
            },
            commments: {
                email: "johndoe@example.com",
                feedback: "Great candidate, good understanding of front-end technologies."
            },
            status: "Pending",
            priority: "Medium",
            priorityBadgeBg: "warning"
        },
        {
            "id": 2,
            "applicantsName": "Jane Smith",
            "technology": "Node.js",
            operation: {
                edit: "Edit",
                view: "View",
                delete: "Delete"
            },
            "comments": {
                "email": "janesmith@example.com",
                "feedback": "Strong back-end experience, needs improvement in database management."
            },
            "status": "Interview Scheduled",
            "priority": "High",
            "priorityBadgeBg": "danger"
        },
        {
            "id": 3,
            "applicantsName": "Alice Johnson",
            "technology": "Angular",
            operation: {
                edit: "Edit",
                view: "View",
                delete: "Delete"
            },
            "comments": {
                "email": "alicej@example.com",
                "feedback": "Good understanding of Angular, but lacks experience in building complex applications."
            },
            "status": "Reviewed",
            "priority": "Low",
            "priorityBadgeBg": "secondary"
        },
        {
            "id": 4,
            "applicantsName": "Bob Lee",
            "technology": "Vue.js",
            operation: {
                edit: "Edit",
                view: "View",
                delete: "Delete"
            },
            "comments": {
                "email": "boblee@example.com",
                "feedback": "Basic knowledge of Vue.js, suitable for junior roles."
            },
            "status": "Pending",
            "priority": "Medium",
            "priorityBadgeBg": "warning"
        },
        {
            "id": 5,
            "applicantsName": "Chris Martin",
            "technology": "Python",
            operation: {
                edit: "Edit",
                view: "View",
                delete: "Delete"
            },
            "comments": {
                "email": "chrismartin@example.com",
                "feedback": "Solid Python skills, lacks knowledge of web frameworks."
            },
            "status": "Shortlisted",
            "priority": "High",
            "priorityBadgeBg": "danger"
        },
        {
            "id": 6,
            "applicantsName": "Emily Brown",
            "technology": "Java",
            operation: {
                edit: "Edit",
                view: "View",
                delete: "Delete"
            },
            "comments": {
                "email": "emilyb@example.com",
                "feedback": "Experienced Java developer, but limited experience with newer frameworks."
            },
            "status": "Interview Scheduled",
            "priority": "Medium",
            "priorityBadgeBg": "warning"
        },
        {
            "id": 7,
            aaplicantsName: "Michael Davis",
            "technology": "C#",
            operation: {
                edit: "Edit",
                view: "View",
                delete: "Delete"
            },
            "comments": {
                "email": "michaeldavis@example.com",
                "feedback": "Very strong C# skills, good fit for enterprise applications."
            },
            "status": "Reviewed",
            "priority": "High",
            "priorityBadgeBg": "danger"
        },
        {
            "id": 8,
            "applicantsName": "Sophia Wilson",
            "technology": "Ruby on Rails",
            operation: {
                edit: "Edit",
                view: "View",
                delete: "Delete"
            },
            "comments": {
                "email": "sophiaw@example.com",
                "feedback": "Solid understanding of Ruby on Rails, but needs more hands-on project experience."
            },
            "status": "Pending",
            "priority": "Low",
            "priorityBadgeBg": "secondary"
        },
        {
            "id": 9,
            "applicantsName": "David Harris",
            "technology": "Swift",
            operation: {
                edit: "Edit",
                view: "View",
                delete: "Delete"
            },
            "comments": {
                "email": "davidharris@example.com",
                "feedback": "Experienced with Swift for iOS development, but not much experience with Android."
            },
            "status": "Shortlisted",
            "priority": "Medium",
            "priorityBadgeBg": "warning"
        },
        {
            "id": 10,
            "applicantsName": "Olivia Moore",
            "technology": "Go",
            operation: {
                edit: "Edit",
                view: "View",
                delete: "Delete"
            },
            "comments": {
                "email": "oliviamoore@example.com",
                "feedback": "Strong experience with Go and cloud-based services."
            },
            "status": "Interview Scheduled",
            "priority": "High",
            "priorityBadgeBg": "danger"
        }
    
    

    //   {
    //     id: 2,
    //     projectName: "Slack Team UI Design",
    //     priority: "High",
    //     priorityBadgeBg: "danger",
    //     hours: 47,
    //     progress: 35,
    //     brandLogo: "/images/brand/slack-logo.svg",
    //     brandLogoBg: "bg-white",
    //     members: [
    //       { image: "images/avatar/avatar-4.jpg" },
    //       { image: "images/avatar/avatar-5.jpg" },
    //       { image: "images/avatar/avatar-6.jpg" },
    //     ],
    //   },
    //   {
    //     id: 3,
    //     projectName: "GitHub Satellite",
    //     priority: "Low",
    //     priorityBadgeBg: "info",
    //     hours: 120,
    //     progress: 75,
    //     brandLogo: "/images/brand/github-logo.svg",
    //     brandLogoBg: "bg-white",
    //     members: [
    //       { image: "images/avatar/avatar-7.jpg" },
    //       { image: "images/avatar/avatar-8.jpg" },
    //       { image: "images/avatar/avatar-9.jpg" },
    //     ],
    //   },
    //   {
    //     id: 4,
    //     projectName: "3D Character Modelling",
    //     priority: "Medium",
    //     priorityBadgeBg: "warning",
    //     hours: 89,
    //     progress: 63,
    //     brandLogo: "/images/brand/3dsmax-logo.svg",
    //     brandLogoBg: "bg-white",
    //     members: [
    //       { image: "images/avatar/avatar-10.jpg" },
    //       { image: "images/avatar/avatar-11.jpg" },
    //       { image: "images/avatar/avatar-12.jpg" },
    //     ],
    //   },
    //   {
    //     id: 5,
    //     projectName: "Webapp Design System",
    //     priority: "Track",
    //     priorityBadgeBg: "success",
    //     hours: 108,
    //     progress: 100,
    //     brandLogo: "/images/brand/layers-logo.svg",
    //     brandLogoBg: "bg-primary",
    //     members: [
    //       { image: "images/avatar/avatar-13.jpg" },
    //       { image: "images/avatar/avatar-14.jpg" },
    //       { image: "images/avatar/avatar-15.jpg" },
    //     ],
    //   },
    //   {
    //     id: 6,
    //     projectName: "Github Event Design",
    //     priority: "Low",
    //     priorityBadgeBg: "info",
    //     hours: 120,
    //     progress: 75,
    //     brandLogo: "/images/brand/github-logo.svg",
    //     brandLogoBg: "bg-white",
    //     members: [
    //       { image: "images/avatar/avatar-16.jpg" },
    //       { image: "images/avatar/avatar-17.jpg" },
    //       { image: "images/avatar/avatar-18.jpg" },
    //     ],
    //   },
];
export default ActiveProjectsData;

