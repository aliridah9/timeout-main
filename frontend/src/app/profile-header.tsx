import { useCurrentSession } from "~/app/auth";

export default function ProfileHeader() {
  const session = useCurrentSession();
  if (!session) {
    throw new Error("Missing session");
  }
  const { firstName, lastName } = session.employee.details;
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-purple text-sm  text-white">
        {firstName[0].toLocaleUpperCase()}
        {lastName[0].toLocaleUpperCase()}
      </div>
      <div className="hidden text-sm lg:block">
        {firstName} {lastName}
      </div>
    </div>
  );
}
