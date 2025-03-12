import { useAuth } from "src/contexts/auth";

const useUserRole = () => {
  const { user } = useAuth();

  const userRoles: Record<string, string> = {
    "4641a3d6-332c-4cac-aeab-34cc77b1fcb2": "Super Administrator",
    "c2533f59-bb62-4ddd-b91e-8e7e6a53bc79": "Sales Agent",
    "de50bb98-cff6-4d1d-9991-690998062bbb": "Partner",
    "be3c8850-bd7b-478c-83da-bd6a384724a6": "Internal Manager",
    "4fa3e2ec-3af5-4630-b700-5bf23270bea7": "Accountant",
    "acd4322c-41a5-4131-9d77-abd972e899b1": "Sales & Approver 1",
    "4b64c526-ddf9-43f0-b4f6-964afbb7dee4": "WABA Bot",
    "a58dd90a-43a4-4805-9a9a-2fa80fdee014": "Field Collector",
    "7feb3d5a-43c4-490b-833a-a924aef5f3a6": "Verificator",
    "9b0c5819-be4b-452d-8c35-ca3d2a32abae": "Verificator Supervisor",
    "dbc34f3-e8f0-4770-8eee-61b7b5c27c0d": "Collection Manager",
    "d64d6187-5cda-46e9-918a-1d644c705567": "Head Of Collection",
    "fc9ca598-4f32-49a7-a565-af545c0da91c": "Soft Collector"
  };

  const roles = user?.roles?.map((roleId: string) => userRoles[roleId]).filter(Boolean) || [];

  // Tentukan tipe return agar TypeScript mengenali properti dinamis
  type RoleConditions = {
    roles: string[];
  } & Record<string, boolean>;

  const roleConditions = Object.values(userRoles).reduce(
    (acc, role) => {
      const key = `is${role.replace(/[^a-zA-Z0-9]/g, "").replace(/\s+/g, "")}`;
      acc[key] = roles.includes(role);
      return acc;
    },
    {} as Record<string, boolean>
  );
  console.log("🚀 ~ useUserRole ~ roleConditions:", roleConditions);

  return {
    roles,
    ...roleConditions
  } as RoleConditions;
};

export default useUserRole;
