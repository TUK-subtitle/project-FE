import { Link } from 'react-router-dom';
import { MdChevronRight } from 'react-icons/md';

const PROFILE_IMAGE = '/Group%20105.png';

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
    period: '2026.03.12 ~ 수강중',
    notes: '15개 노트',
    color: '#4adf96',
  },
  {
    subject: '자료구조',
    period: '2026.03.12 ~ 수강중',
    notes: '8개 노트',
    color: '#ff7f29',
  },
  {
    subject: '소프트웨어공학',
    period: '2026.03.12 ~ 수강중',
    notes: '16개 노트',
    color: '#34cfe4',
  },
  {
    subject: '물리학실험',
    period: '2026.03.12 ~ 수강중',
    notes: '15개 노트',
    color: '#ff6ec5',
  },
] as const;

const days = [
  ['월', '1'],
  ['화', '2'],
  ['수', '3'],
  ['목', '4'],
  ['금', '5'],
  ['토', '6'],
  ['일', '7'],
] as const;

export default function MyPage() {
  return (
    <div className="min-h-screen bg-[#fdfdfd] text-[#545454]">
      <header className="sticky top-0 z-20 flex h-[103px] items-center justify-between bg-white px-[66px]">
        <Link
          to="/mypage"
          className="font-['Chab'] text-[32px] leading-[64px] text-[#00d56e]"
        >
          SpeakView
        </Link>

        <nav className="flex items-center gap-[78px] text-[16px] font-semibold">
          <button className="cursor-pointer text-[#545454]">서비스소개</button>
          <Link to="/recording" className="text-[#545454]">
            실시간자막
          </Link>
          <button className="cursor-pointer text-[#545454]">전체 노트</button>
          <Link to="/mypage" className="text-[#00d56e]">
            마이페이지
          </Link>
        </nav>
      </header>

      <main>
        <section className="bg-gradient-to-b from-[#edf5f1] from-[66%] to-[#fdfdfd] px-[268px] pt-[153px] pb-[92px]">
          <div className="grid grid-cols-[450px_593px] items-start justify-center gap-[180px]">
            <section className="flex flex-col items-start">
              <div className="size-[450px] overflow-hidden rounded-full bg-[#00d56e]">
                <img
                  src={PROFILE_IMAGE}
                  alt="최세연 프로필"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="mt-[52px] flex items-end gap-[8px]">
                <h1 className="text-[48px] leading-none font-bold text-black">
                  최세연
                </h1>
                <span className="text-[32px] leading-none font-medium text-[#545454]">
                  님
                </span>
              </div>
            </section>

            <ScheduleCard />
          </div>

          <StatsCard />
        </section>

        <section className="px-[268px] pt-[126px] pb-[180px]">
          <LectureTabs />
          <div className="mt-[82px] flex flex-col gap-[24px]">
            {lectures.map((lecture) => (
              <LectureRow key={`${lecture.subject}-${lecture.color}`} {...lecture} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function ScheduleCard() {
  return (
    <section className="relative h-[496px] w-[593px] rounded-[20px] bg-white px-[31px] pt-[29px]">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[32px] leading-none font-bold text-black">
            오늘, 목요일
          </h2>
        </div>
        <p className="mt-[5px] text-[24px] font-medium text-[#959595]">
          2026.05.03
        </p>
        <button className="mt-[9px] cursor-pointer text-[24px] font-medium text-[#959595]">
          더보기
        </button>
      </div>

      <div className="mt-[32px] grid grid-cols-7 border-b border-[#c4c4c4] pb-[28px]">
        {days.map(([day, date]) => {
          const active = day === '목';
          return (
            <div key={day} className="flex flex-col items-center gap-[16px]">
              <span className="text-[20px] font-semibold text-[#545454]">
                {day}
              </span>
              <span
                className={`flex size-[50px] items-center justify-center rounded-full text-[32px] font-bold ${
                  active ? 'bg-[#00d56e] text-white' : 'text-black'
                }`}
              >
                {date}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-[27px] flex flex-col gap-[18px]">
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
    <div className="flex h-[64px] items-center gap-[28px] rounded-[10px] bg-white px-[17px] shadow-[0_0_4px_rgba(0,0,0,0.25)]">
      <span
        className={`flex h-[35px] w-[150px] items-center justify-center rounded-[5px] text-[20px] font-medium ${styles[tone]}`}
      >
        {subject}
      </span>
      <span className="min-w-0 truncate text-[20px] font-medium text-[#3a3a3a]">
        {title}
      </span>
    </div>
  );
}

function StatsCard() {
  const stats = [
    ['학교', '한국공학대학교'],
    ['학점', '3.5'],
    ['강의 수', '7'],
  ];

  return (
    <section className="mx-auto mt-[85px] grid h-[214px] max-w-[1384px] grid-cols-3 rounded-[20px] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.25)]">
      {stats.map(([label, value], index) => (
        <div
          key={label}
          className={`flex flex-col items-center justify-center ${
            index > 0 ? 'border-l border-[#c4c4c4]' : ''
          }`}
        >
          <p className="text-[24px] font-medium text-[#00d56e]">{label}</p>
          <p className="mt-[31px] text-[32px] font-bold text-black">{value}</p>
        </div>
      ))}
    </section>
  );
}

function LectureTabs() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex gap-[154px]">
          <button className="cursor-pointer text-[20px] font-bold text-[#00d56e]">
            강의목록
          </button>
          <button className="cursor-pointer text-[20px] font-bold text-[#545454]">
            오답노트
          </button>
        </div>

        <div className="flex gap-[76px] text-[20px] font-medium text-[#545454]">
          <button className="cursor-pointer">날짜순</button>
          <button className="cursor-pointer">목록순</button>
        </div>
      </div>
      <div className="relative mt-[26px] h-[8px] border-t border-[#c4c4c4]">
        <div className="absolute left-0 top-[-4px] h-[8px] w-[136px] bg-[#00d56e]" />
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
    <button className="flex h-[100px] w-full cursor-pointer items-center rounded-[20px] border border-[#c4c4c4] bg-white px-[162px] text-left shadow-[0_4px_15px_rgba(0,0,0,0.25)] transition-transform hover:-translate-y-[1px]">
      <span className="w-[320px] text-[24px] font-bold" style={{ color }}>
        {subject}
      </span>
      <span className="flex-1 text-[20px] font-medium text-[#545454]">
        {period}
      </span>
      <span className="flex items-center gap-[8px] text-[18px] font-medium" style={{ color }}>
        {notes}
        <MdChevronRight size={22} />
      </span>
    </button>
  );
}
