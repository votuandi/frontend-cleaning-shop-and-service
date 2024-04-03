import { Grid, useMediaQuery } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import useStyles from './Account.styles'
import { useIsMounted } from 'usehooks-ts'
import { IGetAccountBannerResponse } from '@/utils/api/setting'
import { settingApi } from '@/utils/api'
import { useTranslation } from 'next-i18next'
import Slider from 'react-slick'
import theme from '@/assets/theme'
import AppAlert from '@/components/AppAlert'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

type MainProps = {
  children: React.ReactNode
}

type ICoverBannerSize = {
  width: number
  height: number
}

const SLICK_SETTING = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
}

const Account = (props: MainProps) => {
  const { children } = props
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const sliderRef = useRef(null)
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(760))
  const alert = useSelector((state: RootState) => state.alert)

  const [listCoverBanners, setListCoverBanner] = useState<IGetAccountBannerResponse>([])
  const [coverBannerSize, setCoverBannerSize] = useState<ICoverBannerSize>({
    width: 0,
    height: 0,
  })
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0)

  let handleSlickChange = (index: any) => {
    setCurrentSlideIndex(index)
  }

  let getCoverBanner = async () => {
    try {
      let res = await settingApi.getAccountBanner({
        params: {
          language: 'eng',
          type: 'registration',
        },
      })
      if (res.data.status) setListCoverBanner(res.data.params)
    } catch (e) {
      console.log(e)
    }
  }

  let FetchData = async () => {
    await getCoverBanner()
  }

  useEffect(() => {
    if (isMounted()) return
    FetchData()
  }, [])

  useEffect(() => {
    if (!isMounted()) return
    FetchData()
  }, [locale])

  useEffect(() => {
    // if (!coverBannerRef.current) return;
    const updateSize = () => {
      let _width = window.innerWidth / 2 - 80
      let _height = Math.floor((_width * 928) / 732)
      if (_height > window.innerHeight - 80) {
        _height = window.innerHeight - 80
        _width = Math.floor((_width * 732) / 928)
      }
      console.log(_width, _height)

      setCoverBannerSize({
        height: _height,
        width: _width,
      })
    }
    window.addEventListener('resize', updateSize)
    updateSize()
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const { classes } = useStyles({
    params: {
      coverBannerHeight: coverBannerSize.height,
      coverBannerWidth: coverBannerSize.width,
      coverBannerUrl: listCoverBanners[currentSlideIndex] ? (listCoverBanners[currentSlideIndex].image ? listCoverBanners[currentSlideIndex].image : '') : '',
    },
  })

  let isMounted = useIsMounted()

  return (
    <div className={classes.root}>
      {alert.message.length > 0 && <AppAlert />}
      <Grid container>
        <Grid item xs={isSmallScreen ? 12 : 6} className={classes.halfSide}>
          {children}
        </Grid>
        {!isSmallScreen && (
          <Grid item xs={6} className={classes.halfSide}>
            <Slider {...SLICK_SETTING} ref={sliderRef} afterChange={handleSlickChange}>
              {listCoverBanners.map((item, index) => {
                return (
                  <div className="w-fit relative h-screen " key={index}>
                    <div className="w-full h-full flex flex-col justify-center items-center">
                      <div className="relative w-fit h-fit">
                        <div className={classes.rightSide} style={{ backgroundImage: `url(${item.image})` }}></div>
                        <svg className="absolute w-0 h-0">
                          <clipPath id="my-clip-path" clipPathUnits="objectBoundingBox">
                            <path d="M0.956,0 H0.173 C0.149,0,0.13,0.015,0.13,0.034 V0.058 C0.13,0.077,0.11,0.092,0.086,0.092 H0.044 C0.02,0.092,0,0.108,0,0.127 V0.862 C0,0.881,0.02,0.897,0.044,0.897 H0.111 C0.135,0.897,0.154,0.912,0.154,0.931 V0.966 C0.154,0.985,0.174,1,0.198,1 H0.708 C0.732,1,0.752,0.985,0.752,0.966 V0.931 C0.752,0.912,0.772,0.897,0.796,0.897 H0.956 C0.98,0.897,1,0.881,1,0.862 V0.034 C1,0.015,0.98,0,0.956,0"></path>
                          </clipPath>
                        </svg>
                        <div className={classes.leftBtn} onClick={() => (sliderRef.current as any).slickPrev()}>
                          <div className={classes.insideBtn}>
                            <img className="w-[24px] h-auto z-10" src="/icon/ic-Arrow-Left.svg" alt="" />
                          </div>
                        </div>
                        <div className={classes.rightBtn} onClick={() => (sliderRef.current as any).slickNext()}>
                          <div className={classes.insideBtn}>
                            <img className="w-[24px] h-auto" src="/icon/ic-Arrow-Right.svg" alt="" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </Slider>
            {/* </div> */}
          </Grid>
        )}
      </Grid>
    </div>
  )
}

export default Account
