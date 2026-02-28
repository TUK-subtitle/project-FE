import type { TranscriptEntry } from '@/types/recording';
import participant1Image from '@/assets/avatars/participant1.png';
import participant2Image from '@/assets/avatars/participant2.png';

interface TranscriptItemProps {
  entry: TranscriptEntry;
}

export default function TranscriptItem({ entry }: TranscriptItemProps) {
  const isHost = entry.speakerType === 'host';
  const avatarSrc = isHost ? participant1Image : participant2Image;

  return (
    <div className="flex flex-col gap-[8px]">
      <p className="text-[16px] leading-normal font-bold text-[#c4c4c4]">
        {entry.timestamp}
      </p>
      <div className="flex gap-[16px]">
        <div className="flex shrink-0 flex-col items-center gap-[2px]">
          <img
            src={avatarSrc}
            alt={entry.speaker}
            className="size-[30px] rounded-full object-cover"
          />
          <span className="text-[10px] font-medium text-black">
            {entry.speaker}
          </span>
        </div>
        <p className="text-[14px] leading-normal font-medium whitespace-pre-wrap text-black">
          {entry.text}
        </p>
      </div>
    </div>
  );
}
