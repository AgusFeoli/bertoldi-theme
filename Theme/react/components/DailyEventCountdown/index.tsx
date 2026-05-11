import React, { useEffect, useState } from 'react';

// INTERFACES
import { DailyEventCountdownProps, DailyModeItem, TimeLeft } from './interfaces';

// COMPONENTS
import Countdown from './components/Countdown'

// HELPERS
import { getTimeLeft } from './helpers/getTimeLeft';
import { showTodayFn } from './helpers/showTodayFn';

// STYLES
// @ts-ignore
import style from './index.css';

declare const require: (path: string) => { default: unknown };

const DailyEventCountdown = ({
  enabled,
  image,
  backgroundColor,
  dailyMode,
  eventMode,
  showFormSuscription = true,
  FormSuscription
}: DailyEventCountdownProps) => {
  console.log(backgroundColor)
  const [changeMode, setChangeMode] = useState(0);
  const [text1, setText1] = useState<string>();
  const [text2, setText2] = useState<string>();
  const [endDate, setEndDate] = useState<Date>();
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>();
  const [showToday, setShowToday] = useState<boolean>(true);

  useEffect(() => {

    const start = new Date(eventMode?.startDate as string);
    const end = new Date(eventMode?.endDate as string);
    const now = new Date();

    if (eventMode?.enabled && start && end && end >= start && now >= start && now <= end) {

      // SET EVENT MODE
      setText1(eventMode.text1)
      setText2(eventMode.text2)
      setEndDate(end)

    } else {

      // SET DAILY MODE
      if (enabled && (dailyMode?.items?.length as number) > 0) {

        // quitar items sin startHour
        const validItems = (dailyMode?.items as DailyModeItem[]).filter(item => item.startHour) as Array<DailyModeItem & { startHour: string }>;

        if (validItems?.length > 0) {

          // ordenar por hora
          validItems.sort((a, b) => a.startHour.localeCompare(b.startHour));

          const now = new Date()

          const currentTime = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0") + ":" + String(now.getSeconds()).padStart(2, "0");

          let currentIndex = -1

          for (let i = 0; i < validItems.length; i++) {

            if (validItems[i].startHour <= currentTime) {
              currentIndex = i
            }

          }

          // si todavía no empezó ninguno hoy
          if (currentIndex === -1) {

            currentIndex = 0

          }

          const currentItem = validItems[currentIndex]
          const nextItem = validItems[currentIndex + 1]

          const today = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");

          let end: Date;

          if (nextItem) {

            end = new Date(`${today}T${nextItem.startHour}`)

          } else {

            end = new Date(`${today}T23:59:59`)

          }

          // Validamos si hoy es sabado, domingo o feriado. Mostramos si corresponde
          const checkVisibility = async () => {

            try {

              const isHolidayOrWeekend = await showTodayFn();
              setShowToday(isHolidayOrWeekend);

            } catch (error) {

              console.error("Error validando feriados:", error);
              setShowToday(false);

            }

          };

          checkVisibility();

          setText1(currentItem.text1)
          setText2(currentItem.text2)
          setEndDate(end)

        }

      }

    }

  }, [eventMode, changeMode])

  useEffect(() => {

    let timer: ReturnType<typeof setInterval>;

    if (endDate) {

      timer = setInterval(() => {

        setTimeLeft(getTimeLeft(endDate))

      }, 1000)

    }

    return () => clearInterval(timer)

  }, [endDate])

  useEffect(() => {

    if (!timeLeft) {

      setChangeMode(prev => prev + 1);

    }

  }, [timeLeft])

  if (enabled && showToday) {

    return (

      <div className={style.topCountdownBarWrapper}>


        <div className={style.topCountdownBar} style={{ backgroundColor }}>

          <div className={style.topCountdownBar__content}>
            <div className={style.columnLeft}>

              {
                timeLeft ?

                  <>

                    <div className={style.topCountdownBarTextContainer}>

                      {
                        image ?

                          <img src={image} alt="" />

                          :

                          null
                      }

                      <div className={style.topCountdownBarTextBarrel}>

                        <p>{text1}</p>
                        <p className={style.topCountdownBar__text2}>{text2}</p>

                        {
                          showFormSuscription && FormSuscription ?

                            <div className={style.formContainer}>
                              <FormSuscription />
                            </div>

                            :

                            null
                        }

                      </div>

                    </div>

                    <Countdown timeLeft={timeLeft} />

                  </>

                  :

                  null

              }

            </div>

          </div>

        </div>

      </div>

    )

  }

  return null;

}

DailyEventCountdown.schema = require('./schema').default;

export default DailyEventCountdown;
