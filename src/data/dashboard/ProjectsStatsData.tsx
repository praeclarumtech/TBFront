
import { Briefcase, ListTask, People, Bullseye } from "react-bootstrap-icons";
import { ProjectsStatsProps } from "types";

export const ProjectsStats: ProjectsStatsProps[] = [
  {
    id: 1,
    title: "Total Applicants",
    value: 18,
    icon: <Briefcase size={18} />,
    statInfo: '<span className="text-dark me-2">2</span> applicants today',
  },
  {
    id: 2,
    title: "Applicants on Hold",
    value: 132,
    icon: <ListTask size={18} />,
    statInfo: '<span className="text-dark me-2">28</span> from last week',
  },
  {
    id: 3,
    title: "Applicant on Interview",
    value: 12,
    icon: <People size={18} />,
    statInfo: '<span className="text-dark me-2">1</span> Completed today',
  },
  {
    id: 4,
    title: "Productivity",
    value: "76%",
    icon: <Bullseye size={18} />,
    statInfo: '<span className="text-dark me-2">5%</span> Completed',
  },
];
export default ProjectsStats;
