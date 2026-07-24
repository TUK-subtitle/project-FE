import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdChevronRight, MdClose } from 'react-icons/md';
import { getContents, type ContentItem } from '@/api/content';

const PROFILE_IMAGE = '/Group%20105.png';
const PAGE_WIDTH_CLASS = 'max-w-[1180px]';

const scheduleItems = [
  {
    subject: '소프트웨어공학',
    title: '디자인 패턴의 이해와 실습',
    tone: 'green' as const,
  },
  {
    subject: '자료구조',
    title: '해시 테이블과 성능 최적화',
    tone: 'orange' as const,
  },
  {
    subject: '물리학실험',
    title: '전자기 유도 현상 측정 실험',
    tone: 'blue' as const,
  },
] as const;

const lectures = [
  {
    subject: '소프트웨어공학',
    period: '2026.03.02 ~ 수강중',
    notes: '3개 노트',
    color: '#4adf96',
  },
  {
    subject: '자료구조',
    period: '2026.03.02 ~ 수강중',
    notes: '2개 노트',
    color: '#ff7f29',
  },
  {
    subject: '물리학실험',
    period: '2026.03.02 ~ 수강중',
    notes: '2개 노트',
    color: '#34cfe4',
  },
] as const;

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'] as const;
const DEFAULT_USER_ID = 1;

function getTodayInfo() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  const dayName = DAY_NAMES[now.getDay()];

  // Get current week (Mon-Sun)
  const currentDay = now.getDay(); // 0 (Sun) to 6 (Sat)
  const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return [DAY_NAMES[d.getDay()], String(d.getDate())] as [string, string];
  });

  return {
    fullDate: `${year}.${month}.${date}`,
    dayName,
    weekDays,
    todayDate: String(now.getDate()),
  };
}

function getStoredUserId() {
  const storedUser = localStorage.getItem('speakview:user');
  if (!storedUser) return DEFAULT_USER_ID;

  try {
    const user = JSON.parse(storedUser) as { id?: number };
    return user.id ?? DEFAULT_USER_ID;
  } catch {
    return DEFAULT_USER_ID;
  }
}

function formatContentSavedAt(createdAt: string) {
  return {
    date: createdAt.slice(0, 10).replaceAll('-', '.'),
    time: createdAt.slice(11, 16),
  };
}

export default function MyPage() {
  const { fullDate, dayName, weekDays, todayDate } = getTodayInfo();
  const [selectedLecture, setSelectedLecture] = useState<(typeof lectures)[number] | null>(null);
  const [lectureContents, setLectureContents] = useState<ContentItem[]>([]);
  const [isContentsLoading, setIsContentsLoading] = useState(false);
  const [contentsError, setContentsError] = useState('');

  const handleLectureClick = async (lecture: (typeof lectures)[number]) => {
    if (selectedLecture?.subject === lecture.subject) {
      setSelectedLecture(null);
      setLectureContents([]);
      setContentsError('');
      return;
    }

    setSelectedLecture(lecture);
    setLectureContents([]);
    setContentsError('');
    setIsContentsLoading(true);

    try {
      const contents = await getContents(getStoredUserId(), lecture.subject);
      setLectureContents(contents);
    } catch (error) {
      console.error('[Content] 강의 목록 조회 실패:', error);
      setContentsError('노트 목록을 불러오지 못했습니다.');
    } finally {
      setIsContentsLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-[#545454]">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div
          className="mx-auto flex h-[80px] w-full items-center justify-between px-[40px] sm:px-[56px] lg:px-[72px]"
        >
          <Link
            to="/main"
            className="font-['Chab'] text-[26px] leading-[64px] text-[#00d56e]"
          >
            SpeakView
          </Link>

          <nav className="ml-auto flex items-center gap-[78px] text-[16px] font-semibold">
            <Link to="/main" className="text-[#545454]">
              서비스소개
            </Link>
            <Link to="/recording" className="text-[#545454]">
              실시간자막
            </Link>
            <Link to="/mypage" className="text-[#00d56e]">
              마이페이지
            </Link>
          </nav>
        </div>
      </header>

      <main className="pt-[80px]">
        <section className="bg-gradient-to-b from-[#f7faf8] to-[#fdfdfd] pt-[100px] pb-[60px]">
          <div
            className={`mx-auto flex w-full ${PAGE_WIDTH_CLASS} items-start`}
          >
            <div className="flex flex-1 justify-center">
              <section className="flex flex-col items-center">
                <div className="size-[280px] overflow-hidden">
                  <img
                    src={PROFILE_IMAGE}
                    alt="최세연 프로필"
                    className="h-full w-full object-cover"
                  />
                </div>
              </section>
            </div>

            <ScheduleCard 
              fullDate={fullDate} 
              dayName={dayName} 
              weekDays={weekDays} 
              todayDate={todayDate} 
            />
          </div>

          <div className={`mx-auto ${PAGE_WIDTH_CLASS} mt-[60px] relative`}>
            <div className="absolute top-[-52px] left-[20px] flex items-baseline gap-[4px]">
              <h1 className="text-[26px] font-bold text-[#111111]">
                최세연
              </h1>
              <span className="text-[16px] font-medium text-[#777777]">
                님
              </span>
            </div>
            <StatsCard />
          </div>
        </section>

        <section
          className={`mx-auto ${PAGE_WIDTH_CLASS} pt-[80px] pb-[120px]`}
        >
          <div className="flex gap-[40px] items-start min-h-[600px]">
            {/* Left Side: Lecture List */}
            <div 
              className={`transition-all duration-500 ease-in-out ${
                selectedLecture ? 'w-[480px]' : 'w-full'
              }`}
            >
              <LectureTabs />
              <div className="mt-[48px] flex flex-col gap-[16px]">
                {lectures.map((lecture) => (
                  <LectureRow
                    key={`${lecture.subject}-${lecture.color}`}
                    lecture={lecture}
                    onClick={() => void handleLectureClick(lecture)}
                    active={selectedLecture?.subject === lecture.subject}
                    isNarrow={!!selectedLecture}
                  />
                ))}
              </div>
            </div>

            {/* Right Side: Detail Panel */}
            <div 
              className={`transition-all duration-500 ease-in-out border border-gray-100 rounded-[12px] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden ${
                selectedLecture ? 'flex-1 opacity-100 translate-x-0' : 'w-0 opacity-0 translate-x-12'
              }`}
            >
              {selectedLecture && (
                <div className="p-[40px] flex flex-col h-full bg-white">
                  <div className="flex items-center justify-between mb-[32px]">
                    <h3 className="text-[22px] font-bold text-[#111111]">
                      <span style={{ color: selectedLecture.color }}>{selectedLecture.subject}</span>
                    </h3>
                    <button 
                      onClick={() => setSelectedLecture(null)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-[#999999] hover:text-[#333333]"
                    >
                      <MdClose size={24} />
                    </button>
                  </div>

                  <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                    {isContentsLoading ? (
                      <div className="p-5 rounded-[20px] bg-[#fcfcfc] border border-gray-100 text-[14px] font-medium text-[#999999]">
                        노트 목록을 불러오는 중입니다.
                      </div>
                    ) : contentsError ? (
                      <div className="p-5 rounded-[20px] bg-[#fcfcfc] border border-gray-100 text-[14px] font-medium text-[#ff5b5b]">
                        {contentsError}
                      </div>
                    ) : lectureContents.length === 0 ? (
                      <div className="p-5 rounded-[20px] bg-[#fcfcfc] border border-gray-100 text-[14px] font-medium text-[#999999]">
                        저장된 노트가 없습니다.
                      </div>
                    ) : (
                      lectureContents.map((content) => {
                        const { date, time } = formatContentSavedAt(content.createdAt);

                        return (
                          <div 
                            key={content.id}
                            className="p-5 rounded-[20px] bg-[#fcfcfc] border border-gray-100 hover:border-[#00d56e]/30 hover:bg-white transition-all cursor-pointer group"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <p className="text-[16px] font-bold text-[#333333] group-hover:text-[#00d56e] transition-colors">{content.title}</p>
                            </div>
                            <div className="flex gap-3 text-[13px] text-[#999999]">
                              <span>{date}</span>
                              <span>•</span>
                              <span>{time} 저장</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function ScheduleCard({ 
  fullDate, 
  dayName, 
  weekDays, 
  todayDate 
}: { 
  fullDate: string; 
  dayName: string; 
  weekDays: [string, string][]; 
  todayDate: string; 
}) {
  return (
    <section className="relative h-auto w-[460px] rounded-[24px] bg-white p-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-[10px]">
          <h2 className="text-[20px] font-bold text-[#111111]">
            오늘, {dayName}요일
          </h2>
          <p className="text-[14px] font-medium text-[#999999]">{fullDate}</p>
        </div>
        <button className="cursor-pointer text-[13px] font-semibold text-[#00d56e] hover:underline">
          더보기
        </button>
      </div>

      <div className="mt-[20px] grid grid-cols-7 border-b border-gray-100 pb-[20px]">
        {weekDays.map(([day, date]) => {
          const active = date === todayDate;
          return (
            <div key={`${day}-${date}`} className="flex flex-col items-center gap-[10px]">
              <span className="text-[13px] font-medium text-[#888888]">
                {day}
              </span>
              <span
                className={`flex size-[30px] items-center justify-center rounded-full text-[14px] font-bold transition-all ${
                  active ? 'bg-[#00d56e] text-white shadow-md shadow-[#00d56e]/20' : 'text-[#333333] hover:bg-gray-50'
                }`}
              >
                {date}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-[20px] flex flex-col gap-[10px]">
        {scheduleItems.map((item) => (
          <ScheduleItem key={`${item.subject}-${item.tone}`} {...item} />
        ))}
      </div>
    </section>
  );
}

function ScheduleItem({
  subject,
  title,
  tone,
}: {
  subject: string;
  title: string;
  tone: 'green' | 'orange' | 'blue';
}) {
  const styles = {
    green: 'bg-[#edf5f1] text-[#00d56e]',
    orange: 'bg-[#fff6e3] text-[#ff7f29]',
    blue: 'bg-[#e7fbff] text-[#34cfe4]',
  };

  return (
    <Link
      to="/recording"
      state={{ subject, title }}
      className="flex h-[48px] items-center gap-[12px] rounded-[12px] border border-gray-100 bg-white px-[12px] shadow-sm transition-transform hover:translate-x-1 focus:ring-2 focus:ring-[#00d56e]/30 focus:outline-none"
    >
      <span
        className={`flex h-[24px] w-[90px] items-center justify-center rounded-full text-[12px] font-semibold ${styles[tone]}`}
      >
        {subject}
      </span>
      <span className="min-w-0 truncate text-[14px] font-medium text-[#444444]">
        {title}
      </span>
    </Link>
  );
}

function StatsCard() {
  const stats = [
    ['학교', '한국공학대학교'],
    ['학점', '3.5'],
    ['강의 수', '3'],
  ];

  return (
    <section className="grid h-[140px] grid-cols-3 rounded-[24px] bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      {stats.map(([label, value], index) => (
        <div
          key={label}
          className={`flex flex-col items-center justify-center ${
            index > 0 ? 'border-l border-gray-100' : ''
          }`}
        >
          <p className="text-[15px] font-semibold text-[#00d56e] tracking-tight">{label}</p>
          <p className="mt-[12px] text-[20px] font-bold text-[#111111]">{value}</p>
        </div>
      ))}
    </section>
  );
}


function LectureTabs() {
  return (
    <div className="border-b border-gray-100 pb-2">
      <div className="flex items-center justify-between px-2">
        <div className="flex gap-8">
          <button className="relative cursor-pointer text-[18px] font-bold text-[#00d56e]">
            강의목록
            <div className="absolute -bottom-[10px] left-0 h-[3px] w-full bg-[#00d56e] rounded-full" />
          </button>
        </div>
      </div>
    </div>
  );
}

function LectureRow({
  lecture,
  onClick,
  active,
  isNarrow,
}: {
  lecture: (typeof lectures)[number];
  onClick: () => void;
  active: boolean;
  isNarrow: boolean;
}) {
  return (
    <button 
      onClick={onClick}
      className={`grid h-[80px] w-full cursor-pointer items-center rounded-[20px] border transition-all duration-500 hover:shadow-md hover:-translate-y-[2px] ${
        active 
          ? 'border-[#00d56e] bg-[#f7faf8] shadow-sm shadow-[#00d56e]/5' 
          : 'border-gray-100 bg-white shadow-sm'
      } ${
        isNarrow ? 'grid-cols-[140px_1fr_90px] px-[24px]' : 'grid-cols-[200px_1fr_120px] px-[48px]'
      }`}
    >
      <span className={`font-bold transition-all duration-500 ${isNarrow ? 'text-[16px]' : 'text-[18px]'}`} style={{ color: lecture.color }}>
        {lecture.subject}
      </span>
      <span className={`font-medium text-[#777777] transition-all duration-500 truncate ${isNarrow ? 'text-[13px]' : 'text-[15px]'}`}>
        {lecture.period}
      </span>
      <span
        className={`flex items-center justify-end gap-[4px] font-semibold transition-all duration-500 ${isNarrow ? 'text-[13px]' : 'text-[15px]'}`}
        style={{ color: lecture.color }}
      >
        {lecture.notes}
        <MdChevronRight size={isNarrow ? 16 : 18} />
      </span>
    </button>
  );
}
