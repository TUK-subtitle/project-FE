import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const SHOWCASE_STEPS = [
  {
    eyebrow: 'FEATURE 01',
    keyword: 'Real-time',
    title: '말하는 순간 바로 보이는\n실시간 자막',
    description:
      '수업과 회의가 진행되는 동안 발화가 즉시 텍스트로 정리됩니다. 사람 1, 사람 2처럼 화자를 구분해 같은 순간을 더 선명하게 공유합니다.',
    image: '/recording-preview.png',
    alt: 'SpeakView 실시간 자막 화면',
  },
  {
    eyebrow: 'FEATURE 02',
    keyword: 'Summary',
    title: '끝난 뒤에는\n핵심만 남는 전체 요약',
    description:
      '긴 대화를 다시 처음부터 훑지 않아도 되도록, SpeakView가 핵심 문장과 중요한 맥락만 남겨 빠르게 복습할 수 있는 구조를 만듭니다.',
    image: '/final-summary-preview.png',
    alt: 'SpeakView 전체 요약 화면',
  },
] as const;

export default function MainPage() {
  const [scrollY, setScrollY] = useState(0);
  const [time, setTime] = useState(0);
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [showcaseProgress, setShowcaseProgress] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const showcaseRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setViewportHeight(window.innerHeight);

      if (showcaseRef.current) {
        const rect = showcaseRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const totalScrollable = Math.max(rect.height - viewportHeight, 1);
        const progressed = Math.min(
          totalScrollable,
          Math.max(0, -rect.top),
        );

        setShowcaseProgress(
          Math.min(1, Math.max(0, progressed / totalScrollable)),
        );
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let frameId = 0;

    const tick = () => {
      setTime(Date.now());
      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsHeroVisible(true);
    }, 220);

    return () => window.clearTimeout(timer);
  }, []);

  const glowOffset = Math.min(scrollY * 0.42, 92);
  const secondaryGlowOffset = Math.min(scrollY * 0.28, 58);
  const primaryFloatX =
    Math.sin(time / 1100) * 320 + Math.cos(time / 2100) * 140;
  const primaryFloatY =
    Math.cos(time / 1500) * 190 + Math.sin(time / 2400) * 90;
  const primaryScale = 1.04 + (Math.sin(time / 1400) + 1) * 0.07;
  const primaryOpacity = 0.14 + ((Math.sin(time / 1300) + 1) / 2) * 0.08;
  const secondaryFloatX =
    Math.cos(time / 1250) * 340 + Math.sin(time / 1900) * 150;
  const secondaryFloatY =
    Math.sin(time / 1000) * 200 + Math.cos(time / 2200) * 80;
  const secondaryScale = 1.02 + (Math.cos(time / 1350) + 1) * 0.08;
  const secondaryOpacity = 0.12 + ((Math.cos(time / 1200) + 1) / 2) * 0.1;
  const realtimeFade = clamp((showcaseProgress - 0.36) / 0.22, 0, 1);
  const realtimeOpacity = 1 - realtimeFade;
  const summaryOpacity = clamp((showcaseProgress - 0.58) / 0.18, 0, 1);
  const realtimeContentProgress = clamp((showcaseProgress - 0.04) / 0.56, 0, 1);
  const summaryContentProgress = clamp((showcaseProgress - 0.62) / 0.3, 0, 1);
  const realtimeContentTranslateY =
    realtimeContentProgress < 0.22
      ? 36 - (realtimeContentProgress / 0.22) * 88
      : realtimeContentProgress < 0.76
        ? -52
        : -52 - ((realtimeContentProgress - 0.76) / 0.24) * 92;
  const summaryContentTranslateY =
    summaryContentProgress < 0.14
      ? 36 - (summaryContentProgress / 0.14) * 92
      : summaryContentProgress < 0.9
        ? -56
        : -56 - ((summaryContentProgress - 0.9) / 0.1) * 88;
  const showcaseSectionTop = showcaseRef.current?.offsetTop ?? 0;
  const showcaseSectionHeight = showcaseRef.current?.offsetHeight ?? 0;
  const showcaseCanvasHeight = Math.max(viewportHeight - 103, 0);
  const showcasePinStart = showcaseSectionTop - 103;
  const showcasePinEnd = showcaseSectionTop + showcaseSectionHeight - viewportHeight;
  const isShowcasePinned =
    scrollY >= showcasePinStart && scrollY <= showcasePinEnd;
  const isShowcaseAfter =
    showcaseCanvasHeight > 0 && scrollY > showcasePinEnd;
  const showcaseFrameTop = isShowcasePinned
    ? 103
    : isShowcaseAfter
      ? showcaseSectionHeight - showcaseCanvasHeight
      : 0;

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-[#545454]">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div
          className="mx-auto flex h-[103px] w-full items-center justify-between px-[40px] sm:px-[56px] lg:px-[72px]"
        >
          <Link
            to="/main"
            className="font-['Chab'] text-[26px] leading-[64px] text-[#00d56e]"
          >
            SpeakView
          </Link>

          <nav className="ml-auto flex items-center gap-[78px] text-[16px] font-semibold">
            <Link to="/main" className="text-[#00d56e]">
              서비스소개
            </Link>
            <Link to="/recording" className="text-[#545454]">
              실시간자막
            </Link>
            <button className="cursor-pointer text-[#545454]">전체 노트</button>
            <Link to="/mypage" className="text-[#545454]">
              마이페이지
            </Link>
          </nav>
        </div>
      </header>

      <main className="pt-[103px]">
        <section className="relative mx-auto flex min-h-[calc(100vh-103px)] w-full max-w-[1440px] items-center justify-center px-6 py-20">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px]"
            style={{
              transform: `translate(calc(-50% + ${Math.min(scrollY * 0.06, 18) + primaryFloatX}px), calc(-50% + ${glowOffset + primaryFloatY}px)) scale(${Math.max(primaryScale, 1 + Math.min(scrollY / 2200, 0.12))})`,
            }}
          >
            <div
              className="h-full w-full rounded-full blur-3xl"
              style={{
                backgroundColor: `rgba(0, 213, 110, ${primaryOpacity})`,
              }}
            />
          </div>

          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[280px]"
            style={{
              transform: `translate(calc(-50% + ${-Math.min(scrollY * 0.1, 28) + secondaryFloatX}px), calc(-50% + ${secondaryGlowOffset - 34 + secondaryFloatY}px)) scale(${Math.max(secondaryScale, 1 + Math.min(scrollY / 2600, 0.09))})`,
            }}
          >
            <div
              className="h-full w-full rounded-full blur-3xl"
              style={{
                backgroundColor: `rgba(122, 240, 172, ${secondaryOpacity})`,
              }}
            />
          </div>

          <div className="relative -translate-y-8 text-center sm:-translate-y-10">
            <h1
              className={`text-[28px] leading-[1.42] font-semibold tracking-[-0.035em] text-[#000000] transition-all duration-[1400ms] ease-out sm:text-[46px] lg:text-[60px] ${
                isHeroVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-4 opacity-0'
              }`}
            >
              <span
                className="relative z-10 text-[#00d56e]"
                style={{
                  textShadow:
                    '0 0 14px rgba(255,255,255,0.96), 0 0 28px rgba(255,255,255,0.88)',
                }}
              >
                실시간 자막
              </span>
              으로
              <br />
              <span
                className="relative z-10 text-[#00d56e]"
                style={{
                  textShadow:
                    '0 0 14px rgba(255,255,255,0.96), 0 0 28px rgba(255,255,255,0.88)',
                }}
              >
                같은 순간
              </span>
              을 공유해요
            </h1>

            <Link
              to="/recording"
              className={`mt-10 inline-flex items-center justify-center rounded-full bg-[#111111] px-6 py-3 text-[15px] font-semibold text-white shadow-[0_14px_34px_rgba(17,24,39,0.18)] transition-all duration-[1200ms] ease-out hover:-translate-y-0.5 hover:bg-[#000000] ${
                isHeroVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-5 opacity-0'
              }`}
              style={{ transitionDelay: '320ms' }}
            >
              실시간 자막 바로가기
            </Link>
          </div>
        </section>

        <section
          ref={showcaseRef}
          className="relative min-h-[260vh] bg-white px-6 pb-12"
        >
          <div
            className={isShowcasePinned ? 'fixed left-1/2 z-10' : 'absolute left-1/2'}
            style={{
              top: showcaseFrameTop,
              transform: 'translateX(-50%)',
              width: 'min(1440px, calc(100vw - 48px))',
              height: showcaseCanvasHeight,
            }}
          >
            <div className="relative h-full overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                opacity: realtimeOpacity,
              }}
            >
              <ShowcaseScene
                step={SHOWCASE_STEPS[0]}
                mode="base"
                contentTranslateY={realtimeContentTranslateY}
              />
            </div>

            <div
              className="absolute inset-0"
              style={{
                opacity: summaryOpacity,
              }}
            >
              <ShowcaseScene
                step={SHOWCASE_STEPS[1]}
                mode="overlay"
                contentTranslateY={summaryContentTranslateY}
              />
            </div>
          </div>
          </div>
        </section>

      </main>
    </div>
  );
}

function ShowcaseCard({
  step,
}: {
  step: (typeof SHOWCASE_STEPS)[number];
}) {
  return (
    <div className="p-1">
      <p className="text-[14px] font-semibold tracking-[0.08em] text-[#00d56e]">
        {step.eyebrow}
      </p>
      <h2 className="mt-2 text-[18px] leading-[1.28] font-semibold tracking-[-0.035em] text-[#111111] sm:text-[22px]">
        {step.title.split('\n').map((line) => (
          <span key={`${step.keyword}-${line}`}>
            {line}
            <br />
          </span>
        ))}
      </h2>
      <p className="mt-5 text-[15px] leading-[1.5] text-[#6c736f]">
        {step.description}
      </p>
    </div>
  );
}

function ShowcaseScene({
  step,
  mode,
  contentTranslateY,
}: {
  step: (typeof SHOWCASE_STEPS)[number];
  mode: 'base' | 'overlay';
  contentTranslateY: number;
}) {
  const isOverlay = mode === 'overlay';
  const isSummary = step.keyword === 'Summary';

  return (
    <div className={`relative h-full ${isOverlay ? 'bg-white' : ''}`}>
      <div
        className="pointer-events-none absolute left-[36%] top-[4%] z-0 -translate-x-1/2 whitespace-nowrap text-[64px] leading-none font-semibold tracking-[-0.08em] text-black/85 sm:text-[110px] lg:text-[180px]"
      >
        {step.keyword}
      </div>

      <div
        className="absolute inset-0 z-10"
        style={{
          transform: `translate3d(0, ${contentTranslateY}px, 0)`,
        }}
      >
        <div
          className="absolute top-[11%] w-full max-w-[360px] right-[5%]"
        >
          <ShowcaseCard step={step} />
        </div>

        <div
          className="absolute bottom-[10%] w-full max-w-[700px] right-[5%]"
        >
          <div className="overflow-hidden rounded-[36px] border border-[#edf1ee] bg-white shadow-[0_30px_90px_rgba(17,24,39,0.1)]">
            <img
              src={step.image}
              alt={step.alt}
              className="h-full w-full object-cover object-left-top"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
