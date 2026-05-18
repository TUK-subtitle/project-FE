import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '@/api/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedLoginId = loginId.trim();
    if (!trimmedLoginId || !password) {
      setErrorMessage('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const user = await login({ loginId: trimmedLoginId, password });
      localStorage.setItem('speakview:user', JSON.stringify(user));
      navigate('/main');
    } catch (error) {
      console.error('[Auth] 로그인 실패:', error);
      setErrorMessage('아이디 또는 비밀번호를 확인해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-[24px]">
      <Link
        to="/login"
        className="absolute top-[25px] left-[66px] font-['Chab'] text-[32px] leading-[64px] text-[#00d56e]"
      >
        SpeakView
      </Link>

      <section className="flex w-[360px] flex-col items-center">
        <h1 className="mb-[27px] text-[20px] leading-[1.5] font-semibold text-black">
          로그인
        </h1>

        <form className="flex w-full flex-col" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="login-id">
            아이디
          </label>
          <input
            id="login-id"
            className="h-[50px] rounded-[20px] border border-[#00ec7a] bg-white px-[28px] text-[16px] text-black shadow-[0_4px_4px_rgba(0,0,0,0.1)] outline-none placeholder:text-[#c4c4c4] focus:ring-2 focus:ring-[#00ec7a]/30"
            placeholder="아이디"
            value={loginId}
            onChange={(event) => setLoginId(event.target.value)}
            autoComplete="username"
          />

          <label className="sr-only" htmlFor="password">
            비밀번호
          </label>
          <input
            id="password"
            className="mt-[16px] h-[50px] rounded-[20px] border border-[#00ec7a] bg-white px-[28px] text-[16px] text-black shadow-[0_4px_4px_rgba(0,0,0,0.1)] outline-none placeholder:text-[#c4c4c4] focus:ring-2 focus:ring-[#00ec7a]/30"
            placeholder="비밀번호"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />

          {errorMessage && (
            <p className="mt-[12px] text-center text-[14px] font-medium text-[#ff5b5b]">
              {errorMessage}
            </p>
          )}

          <button
            className="mt-[28px] h-[50px] cursor-pointer rounded-[20px] border border-[#00d56e] bg-[#00ec7a] text-[20px] leading-[1.5] font-normal text-white shadow-[0_4px_4px_rgba(0,0,0,0.1)] transition-all hover:bg-[#00d56e] disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <Link
          to="/signup"
          className="mt-[26px] text-[16px] leading-[1.5] text-[#c4c4c4] underline"
        >
          회원가입하기
        </Link>
      </section>
    </main>
  );
}
