import { useCallback, useEffect, useRef, useState } from "react";

const LOCALSTORAGE_COUNTDOWN_KEY = "otp_sent_at";

const COUNTDOWN_DURATION_SEC = 30;

// TODO: Make resend button work even after refresh
localStorage.removeItem(LOCALSTORAGE_COUNTDOWN_KEY);

const ResendOtpButton = (props: {
  isLoading: boolean;
  onClick: () => Promise<void>;
}) => {
  const [remainingSec, setRemainingSec] = useState<number | null>(null);

  const setupCountdown = useCallback((otpSentAtTimestamp?: number) => {
    const otpSentAt = otpSentAtTimestamp || Date.now();

    localStorage.setItem(LOCALSTORAGE_COUNTDOWN_KEY, otpSentAt.toString());
    const remainingSec =
      COUNTDOWN_DURATION_SEC - Math.floor((Date.now() - otpSentAt) / 1000);

    // no countdown if remaining countdown less than 0
    if (remainingSec < 0) {
      setRemainingSec(0);
      return;
    }
    setRemainingSec(remainingSec);

    // decrement remainingSec by 1 every second
    countdownIntervalId.current = setInterval(() => {
      setRemainingSec((oldVal) => {
        if (oldVal === null) return null; // should never happen practically, but just to satisfy typescript
        if (oldVal <= 1) {
          clearInterval(countdownIntervalId.current);
          return 0;
        }
        return (
          COUNTDOWN_DURATION_SEC - Math.floor((Date.now() - otpSentAt) / 1000)
        );
      });
    }, 1000);
  }, []);

  const countdownIntervalId = useRef<NodeJS.Timer>();
  useEffect(() => {
    // setupCountdown(
    //   parseInt(localStorage.getItem(LOCALSTORAGE_COUNTDOWN_KEY) ?? "")
    // );

    setupCountdown();

    return () => clearInterval(countdownIntervalId.current);
  }, [setupCountdown]);

  const onClick = () => props.onClick().then(() => setupCountdown());

  if (remainingSec === null) return <></>;

  if (remainingSec === 0)
    return (
      <button
        className={"loginResendOtp"}
        disabled={props.isLoading}
        type="button"
        onClick={onClick}
      >
        Resend OTP
      </button>
    );

  return <p className="loginResendOtp">Resend in {remainingSec}s</p>;
};

export default ResendOtpButton;
