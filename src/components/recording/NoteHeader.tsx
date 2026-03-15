import { MdSearch, MdOutlineShare, MdOutlineDelete } from 'react-icons/md';

interface NoteHeaderProps {
  title: string;
  date: string;
  folder: string;
  showActions?: boolean;
}

export default function NoteHeader({
  title,
  date,
  folder,
  showActions = true,
}: NoteHeaderProps) {
  return (
    <div className="px-[71px] pt-[25px]">
      <div className="flex items-start justify-between">
        <div className="self-center">
          <h2 className="text-[24px] leading-normal font-bold text-[#c4c4c4]">
            {title}
          </h2>
          <p className="mt-[4px] text-[13px] leading-normal font-medium text-[#c4c4c4]">
            {date}
          </p>
          <div className="mt-[4px] flex items-center gap-[8px]">
            <span className="text-[13px] leading-normal font-medium text-[#c4c4c4]">
              폴더 위치
            </span>
            <span className="rounded-[20px] bg-[#ececec] px-[10px] py-[2px] text-[10px] font-medium text-black">
              {folder}
            </span>
          </div>
        </div>

        {showActions && (
          <div className="flex items-center gap-[16px] pt-[65px]">
            <button className="text-[#3a3a3a] hover:text-black">
              <MdSearch size={20} />
            </button>
            <button className="text-[#3a3a3a] hover:text-black">
              <MdOutlineShare size={20} />
            </button>
            <button className="text-[#3a3a3a] hover:text-black">
              <MdOutlineDelete size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
