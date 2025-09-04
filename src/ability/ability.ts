// ability.ts
import { AbilityBuilder, Ability } from "@casl/ability";

export type Actions = "view"; // ✅ only one action
export type Subjects =
  | "Applicants"
  | "import Applicants"
  | "Vendor"
  | "Client"
  | "Email"
  | "Reports"
  | "Add State"
  | "Add Qualification"
  | "Add Role and Skill"
  | "Find and Replace"
  | "Add Email Template"
  | "Add Designation"
  | "master"
  | "Add Skill"
  | "Add City"
  | "Add Country";

export type AppAbility = Ability<[Actions, Subjects]>;

export const defineAbilityFor = (permissions: string[]) => {
  const { can, build } = new AbilityBuilder<AppAbility>(Ability as any);

  // ✅ give "view" for each allowed module
  permissions.forEach((module) => {
    can("view", module as Subjects);
  });

  return build();
};
