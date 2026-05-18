import { Link } from 'react-router-dom';
import { MdChevronRight } from 'react-icons/md';

const PROFILE_IMAGE = '/Group%20105.png';
const PAGE_WIDTH_CLASS = 'max-w-[1180px]';

const scheduleItems = [
  {
    subject: '소프트웨어공학',
    title: '소프트웨어 공학의 모든 것 2장',
    tone: 'green',
  },
  {
    subject: '자료구조',
    title: '소프트웨어 공학의 모든 것 2장',
    tone: 'orange',
  },
  {
    subject: '소프트웨어공학',
    title: '소프트웨어 공학의 모든 것 2장',
    tone: 'blue',
  },
] as const;

const lectures = [
  {
    subject: '소프트웨어공학',
    period: '2026.03.02 ~ 수강중',
    notes: '15개 노트',
    color: '#4adf96',
  },
  {
    subject: '자료구조',
    period: '2026.03.02 ~ 수강중',
    notes: '8개 노트',
    color: '#ff7f29',
  },
  {
    subject: '소프트웨어공학',
    period: '2026.03.02 ~ 수강중',
    notes: '16개 노트',
    color: '#34cfe4',
  },
  {
    subject: '물리학실험',
    period: '2026.03.02 ~ 수강중',
    notes: '15개 노트',
    color: '#ff6ec5',
  },
] as const;

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'] as const;

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

export default function MyPage() {
  const { fullDate, dayName, weekDays, todayDate } = getTodayInfo();

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
            <button className="cursor-pointer text-[#545454]">전체 노트</button>
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
          <LectureTabs />
          <div className="mt-[48px] flex flex-col gap-[16px]">
            {lectures.map((lecture) => (
              <LectureRow
                key={`${lecture.subject}-${lecture.color}`}
                {...lecture}
              />
            ))}
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
    ['강의 수', '7'],
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

        <div className="flex gap-[32px] text-[14px] font-medium text-[#888888]">
          <button className="cursor-pointer hover:text-[#00d56e]">날짜순</button>
          <button className="cursor-pointer hover:text-[#00d56e]">목록순</button>
        </div>
      </div>
    </div>
  );
}

function LectureRow({
  subject,
  period,
  notes,
  color,
}: {
  subject: string;
  period: string;
  notes: string;
  color: string;
}) {
  return (
    <button className="grid h-[80px] w-full cursor-pointer grid-cols-[200px_1fr_120px] items-center rounded-[20px] border border-gray-100 bg-white px-[48px] text-left shadow-sm transition-all hover:shadow-md hover:-translate-y-[2px]">
      <span className="text-[18px] font-bold" style={{ color }}>
        {subject}
      </span>
      <span className="text-[15px] font-medium text-[#777777]">{period}</span>
      <span
        className="flex items-center justify-end gap-[6px] text-[15px] font-semibold"
        style={{ color }}
      >
        {notes}
        <MdChevronRight size={18} />
      </span>
    </button>
  );
}
