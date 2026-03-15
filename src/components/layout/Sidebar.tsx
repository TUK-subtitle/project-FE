import { useState } from 'react';
import {
  MdOutlineHome,
  MdOutlineFolder,
  MdOutlineDescription,
} from 'react-icons/md';
import { PiTrash } from 'react-icons/pi';

export default function Sidebar() {
  const [isFolderOpen, setIsFolderOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<
    'home' | 'all-folder' | 'general-folder' | 'trash'
  >('home');

  return (
    <aside className="flex h-full w-[241px] shrink-0 flex-col border-r border-[#c4c4c4] px-[41px] pt-[19px]">
      <h1 className="font-[Chab] text-[24px] leading-[40px] text-[#00ec7a]">
        SpeakView
      </h1>

      <nav className="mt-[40px] flex flex-col gap-[10px] ">
        <SidebarItem
          icon={<MdOutlineHome size={24} />}
          label="홈"
          active={activeItem === 'home'}
          onClick={() => setActiveItem('home')}
        />
        <SidebarItem
          icon={<MdOutlineFolder size={24} />}
          label="전체 폴더"
          active={activeItem === 'all-folder'}
          onClick={() => {
            setIsFolderOpen((prev) => !prev);
            setActiveItem('all-folder');
          }}
        />
        {isFolderOpen && (
          <SidebarSubItem
            icon={<MdOutlineDescription size={20} />}
            label="일반 폴더"
            active={activeItem === 'general-folder'}
            onClick={() => setActiveItem('general-folder')}
          />
        )}
        <SidebarItem
          icon={<PiTrash size={24} />}
          label="휴지통"
          active={activeItem === 'trash'}
          onClick={() => setActiveItem('trash')}
        />
      </nav>
    </aside>
  );
}

function SidebarItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-[8px] text-[16px] text-[#3a3a3a]"
    >
      <span className="flex items-center">{icon}</span>
      <span className={active ? 'font-bold text-black' : 'font-medium'}>
        {label}
      </span>
    </button>
  );
}

function SidebarSubItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="ml-[15px] flex items-center gap-[8px] text-[14px] text-[#3a3a3a]"
    >
      <span className="flex items-center">{icon}</span>
      <span className={active ? 'font-bold text-black' : 'font-medium'}>
        {label}
      </span>
    </button>
  );
}
