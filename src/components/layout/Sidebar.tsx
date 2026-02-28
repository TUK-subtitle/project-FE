import {
  MdOutlineHome,
  MdOutlineFolder,
  MdOutlineDescription,
} from 'react-icons/md';
import { PiTrash } from 'react-icons/pi';

export default function Sidebar() {
  return (
    <aside className="flex h-full w-[269px] shrink-0 flex-col border-r border-[#c4c4c4] px-[41px] pt-[19px]">
      <h1 className="font-[Chab] text-[24px] leading-[40px] text-[#00ec7a]">
        SpeakView
      </h1>

      <nav className="mt-[20px] flex flex-col gap-[8px]">
        <SidebarItem icon={<MdOutlineHome size={24} />} label="홈" />
        <SidebarItem
          icon={<MdOutlineFolder size={24} />}
          label="전체 폴더"
          bold
        />
        <SidebarSubItem
          icon={<MdOutlineDescription size={20} />}
          label="일반 폴더"
        />
        <SidebarItem icon={<PiTrash size={24} />} label="휴지통" />
      </nav>
    </aside>
  );
}

function SidebarItem({
  icon,
  label,
  bold,
}: {
  icon: React.ReactNode;
  label: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center gap-[8px] text-[16px] text-[#3a3a3a]">
      <span className="flex items-center">{icon}</span>
      <span className={bold ? 'font-bold text-black' : 'font-medium'}>
        {label}
      </span>
    </div>
  );
}

function SidebarSubItem({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="ml-[15px] flex items-center gap-[8px] text-[14px] font-medium text-[#3a3a3a]">
      <span className="flex items-center">{icon}</span>
      <span>{label}</span>
    </div>
  );
}
