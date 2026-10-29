import { UserCircleIcon } from "lucide-react";
import { Doc } from "../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type User = Doc<"users">;

function UserInfo({ user }: { user?: Partial<User> | null }) {
  if (!user) {
    return (
      <div className="flex items-center gap-2 text-slate-400">
        <UserCircleIcon className="h-4 w-4" />
        <span className="text-xs">Unknown Member</span>
      </div>
    );
  }

  const name = user.name || user.email || "Member";
  const initials =
    name
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .join("")
      .slice(0, 2)
      .toUpperCase() || "MB";

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-6 w-6 border border-white/10 shrink-0">
        <AvatarImage src={user.image} />
        <AvatarFallback className="bg-indigo-950 text-indigo-300 text-[10px] font-bold">
          {initials}
        </AvatarFallback>
      </Avatar>
      <span className="truncate max-w-[140px] text-xs font-medium text-slate-200">
        {name}
      </span>
    </div>
  );
}

export default UserInfo;
