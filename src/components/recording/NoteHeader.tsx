import { MdSearch, MdOutlineShare, MdOutlineDelete } from 'react-icons/md';

interface NoteHeaderProps {
  title: string;
  date: string;
  folder: string;
  onTitleChange?: (title: string) => void;
  showActions?: boolean;
}

export default function NoteHeader({
  title,
  date,
  folder,
  onTitleChange,
  showActions = true,
}: NoteHeaderProps) {
  return (
    <div className="px-[71px] pt-[25px]">
      <div className="flex items-start justify-between">
        <div className="self-center">
          {onTitleChange ? (
            <input
              className="w-[360px] bg-transparent text-[24px] leading-normal font-bold text-[#3a3a3a] outline-none transition-colors placeholder:text-[#c4c4c4] hover:text-[#959595] focus:text-[#3a3a3a]"
              value={title}
              placeholder="새로운 노트"
              onChange={(event) => onTitleChange(event.target.value)}
              aria-label="노트 이름"
            />
          ) : (
            <h2 className="text-[24px] leading-normal font-bold text-[#c4c4c4]">
              {title}
            </h2>
          )}
          <p className="mt-[4px] text-[13px] leading-normal font-medium text-[#c4c4c4]">
            {date}
          </p>
          <div className="mt-[4px] flex items-center gap-[8px]">
            <span className="text-[13px] leading-normal font-medium text-[#c4c4c4]">
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
