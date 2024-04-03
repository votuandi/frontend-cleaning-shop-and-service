/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useIsMounted } from 'usehooks-ts'
import { newsApi, productApi, transactionApi } from '@/utils/api'
import { Box, Grid, IconButton, MenuItem, Select, Slide, TextField, useMediaQuery } from '@mui/material'
import useStyles from './ProductDetail.style'
import parse from 'html-react-parser'
import { gotoPage, localStorageAvailable } from '@/utils/helpers/common'
import { IGetProductDetailResponse } from '@/utils/api/product'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import Slider from 'react-slick'
import OnlineShopItem from '@/components/OnlineShopItem'
import theme from '@/assets/theme'
import { capitalize } from 'lodash'
import { setGlobalCart } from '@/slice/cartSlice'
import { useDispatch } from 'react-redux'
import { setAlertMessageState } from '@/slice/alertSlice'

type Query = {
  slug: string
}

export default function ProductDetail() {
  const router = useRouter()
  const query = router.query as unknown as Query
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const photoSliderRef = useRef(null)
  const relativedSliderRef = useRef(null)
  const isMediumScreen = useMediaQuery(theme.breakpoints.down(900))
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(600))
  const dispatch = useDispatch()

  const IMAGES_SLIDER_SETTINGS = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: isSmallScreen ? 4 : isMediumScreen ? 3 : 4,
    slidesToScroll: 1,
  }

  const RELATIVE_SLIDER_SETTINGS = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: isSmallScreen ? 2 : isMediumScreen ? 3 : 4,
    slidesToScroll: 1,
  }

  const [productId, setProductId] = useState<number | string>(0)
  const [productDetail, setProductDetail] = useState<IGetProductDetailResponse | null>(null)
  const [amount, setAmount] = useState<number>(0)
  const [imageIndex, setImageIndex] = useState<number>(0)

  let handleSlickPrev = (_ref: React.MutableRefObject<null>) => {
    if (_ref.current) (_ref.current as any).slickPrev()
  }

  let handleSlickNext = (_ref: React.MutableRefObject<null>) => {
    if (_ref.current) (_ref.current as any).slickNext()
  }

  let getProductDetail = async (_productId?: number | string) => {
    try {
      _productId = _productId ?? productId
      let res = await productApi.getDetail({
        params: {
          language: 'eng',
          product_id: _productId,
        },
      })
      if (res.data.status) {
        setProductDetail(res.data.params)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const addToCart = async () => {
    try {
      const storageAvailable = localStorageAvailable()
      const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
      if (!accessToken) {
        console.log('You have not signed in yet!')
        gotoPage('/sign-in')
      }
      let res = await transactionApi.addToCart({
        params: {
          language: locale === 'en-US' ? 'eng' : 'zho',
          token: accessToken!,
          item_type: 'product',
          item_id: productId,
          qty: amount,
        },
      })
      if (res.data.status) {
        dispatch(setAlertMessageState(`Added ${amount} ${productDetail?.ProductLanguage?.name} to cart successfully!`))
        await getCart()
      } else {
        dispatch(setAlertMessageState(`${t('Adding to cart failed!')}\n${capitalize(res.data.message.replaceAll('_', ' '))}`))
      }
    } catch (error) {
      console.log(error)
      dispatch(setAlertMessageState(t('Adding to cart failed!')))
    }
  }

  let getCart = async () => {
    try {
      const storageAvailable = localStorageAvailable()
      const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
      if (!accessToken) {
        console.log('You have not signed in yet!')
        gotoPage('/sign-in')
      }
      let res = await transactionApi.getCart({
        params: {
          language: locale === 'en-US' ? 'eng' : 'zho',
          token: accessToken!,
        },
      })
      if (res.data.status) {
        dispatch(setGlobalCart(res.data.params))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleAddToCart = async (e: any) => {
    e.stopPropagation()
    await addToCart()
  }

  let FetchData = async (_newsId?: number | string) => {
    await getProductDetail(_newsId)
  }

  useEffect(() => {
    if (isMounted()) return
    const _productId = query.slug.split('-').reverse()[0]
    setProductId(_productId)
    FetchData(_productId)
  }, [])

  useEffect(() => {
    if (!isMounted()) return
    FetchData()
  }, [locale])

  const { classes } = useStyles({ params: {} })
  let isMounted = useIsMounted()

  return (
    <div className="w-full h-fit flex flex-col justify-start items-start gap-6 py-10 px-6">
      <div className="w-full h-fit flex flex-col gap-2">
        <div className="w-full h-fit flex flex-row flex-wrap gap-1">
          <span className="text-xs not-italic font-normal leading-[normal] text-[#b3b3b3] cursor-pointer" onClick={() => gotoPage('/online-shop')}>
            Online shop
          </span>
          <img className="h-4 w-auto" src="/icon/ic-breack.svg" alt="" />
          <span className="text-xs not-italic font-normal leading-[normal] text-[#333]">Product detail</span>
        </div>
        <div className="flex flex-row w-fit h-fit justify-center items-center gap-8 pl-3 border-l-[8px] border-[#0596A6] border-solid">
          <h1 className="text-lg not-italic font-semibold leading-[normal] text-[#1A1A1A]">PRODUCT DETAIL</h1>
        </div>
      </div>

      <Grid container className={classes.imagesAndName}>
        <Grid item xs={12} sm={6} className={classes.photoSide}>
          <img className="h-[310px] w-auto mx-auto" src={productDetail?.ProductImage[imageIndex]} alt="" />
          <div className={classes.imageSlider}>
            <Slider {...IMAGES_SLIDER_SETTINGS} className="w-full" ref={photoSliderRef}>
              {Array.isArray(productDetail?.ProductImage) &&
                productDetail.ProductImage.map((item, index) => (
                  <div key={index}>
                    <img
                      className={`w-[95%] h-[95%] max-h-[138px] max-w-[138px] aspect-square mx-auto rounded-2xl cursor-pointer ${
                        imageIndex === index && 'border-[1px] solid border-black'
                      }`}
                      src={item}
                      alt=""
                      onClick={() => setImageIndex(index)}
                    />
                  </div>
                ))}
            </Slider>
            <button className={`absolute ${isSmallScreen ? 'bottom-[45%] -left-2.5' : ' -bottom-8 left-0'} ${classes.arrowBtn}`} onClick={() => handleSlickPrev(photoSliderRef)}>
              <img className="w-5 h-5" src="/icon/arrow-left.svg" alt="" />
            </button>
            <button className={`absolute ${isSmallScreen ? 'bottom-[45%] -right-2.5' : ' -bottom-8 right-0'} ${classes.arrowBtn}`} onClick={() => handleSlickNext(photoSliderRef)}>
              <img className="w-5 h-5" src="/icon/arrow-right.svg" alt="" />
            </button>
          </div>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            width: '100%',
            paddingLeft: isSmallScreen ? '0' : '16px',
          }}
        >
          <h1 className="text-[32px] font-bold text-[#202020]">{productDetail?.ProductLanguage.name}</h1>
          <div className="flex flex-row w-full justify-start items-center gap-4">
            <span className="text-[#06455E] text-2xl font-semibold">{`HK$ ${productDetail?.price_after_discount}`}</span>
            <span className="text-[#666] text-base font-medium">{`HK$ ${productDetail?.price}`}</span>
          </div>
          <span className={classes.fieldName}>Type</span>
          <span className={classes.fieldContent}>{productDetail?.service_type}</span>
          <span className={classes.fieldName}>Categories</span>
          <span className={classes.fieldContent}>{productDetail?.category_name}</span>
          <span className={classes.fieldName}>Quantity</span>
          <TextField
            className={classes.pickAmountTextField}
            type="number"
            InputProps={{
              startAdornment: (
                <IconButton onClick={() => setAmount((x) => (x === 0 ? 0 : x - 1))} sx={{ marginLeft: -2 }}>
                  <RemoveIcon />
                </IconButton>
              ),
              endAdornment: (
                <IconButton onClick={() => setAmount((x) => x + 1)} sx={{ marginRight: -2 }}>
                  <AddIcon />
                </IconButton>
              ),
            }}
            value={amount}
            onChange={(e: any) => setAmount(e.target.value)}
          ></TextField>
          <button className="w-full h-12 rounded-lg border-[1px] solid border-[#0596A6] text-[#0596A6] text-lg font-medium" onClick={handleAddToCart}>
            {t('Add to cart')}
          </button>
          <button className="w-full h-12 rounded-lg border-[1px] solid bg-[#0596A6] text-white text-lg font-medium">Buy now</button>
        </Grid>
      </Grid>

      <div className={classes.partTitle}>Detail</div>
      <div className="w-full h-fit px-6 flex flex-col text-[#666]">{parse(productDetail?.ProductLanguage?.detail ?? '')}</div>

      <div className={classes.partTitle}>Description</div>
      <div className="px-6 text-base font-normal text-[#666] text-justify">{parse(productDetail?.ProductLanguage?.description ?? '')}</div>

      <Box
        sx={{
          width: isSmallScreen ? '100vw' : '100%',
          padding: isSmallScreen ? '20px 16px' : '20px 24px',
          backgroundColor: '#F0F2F7',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          margin: isSmallScreen ? '0 -24px' : 'auto',
        }}
      >
        <h3 className="text-black text-xl font-semibold">Related products</h3>
        <div className="w-full h-fit relative">
          <Slider {...RELATIVE_SLIDER_SETTINGS} ref={relativedSliderRef}>
            {Array.isArray(productDetail?.related_product) &&
              productDetail?.related_product?.map((item, index) => {
                return <OnlineShopItem item={item} key={index}></OnlineShopItem>
              })}
          </Slider>
          <div className="w-fit h-full flex justify-center items-center absolute top-0 -left-2 z-50">
            <button className={classes.arrowBtn} onClick={() => handleSlickPrev(relativedSliderRef)}>
              <img className="w-5 h-5" src="/icon/arrow-left.svg" alt="" />
            </button>
          </div>
          <div className="w-fit h-full flex justify-center items-center absolute top-0 -right-2 z-50">
            <button className={classes.arrowBtn} onClick={() => handleSlickNext(relativedSliderRef)}>
              <img className="w-5 h-5" src="/icon/arrow-right.svg" alt="" />
            </button>
          </div>
        </div>
      </Box>
    </div>
  )
}
