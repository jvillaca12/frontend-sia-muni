import { IconButton, Paper, Stack, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import ReactSwiper from 'components/base/ReactSwiper';
import { ReactElement, useEffect, useMemo, useState } from 'react';
import { SwiperSlide } from 'swiper/react';
import { Swiper as SwiperClass } from 'swiper/types';
import SlideActivoItem from './SlideActivoItem';
import { top5ActivoMaestroItems } from 'data/trending-items';
import { ActivoGeneralDTO } from 'data/interfaces/ActivoGeneralDTO';

const Top5ActivosAhora = (): ReactElement => {
  const [, setSwiperRef] = useState<SwiperClass>();
  const [activoMaestro, setActivoMaestro] = useState<ActivoGeneralDTO[]>([]);

  useEffect(() => {
    const fetchTop5ActivosMaestros = async () => {
      const activoMaestroData = await top5ActivoMaestroItems();
      setActivoMaestro(activoMaestroData);
    };
    fetchTop5ActivosMaestros();
  }, []);

  const trendingItemsSlides = useMemo(() => activoMaestro, [activoMaestro]);

  return (
    <Paper
      sx={{
        p: { xs: 4, sm: 8 },
        height: 1,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={5}
        mr={-2}
        flexWrap="wrap"
      >
        <Typography variant="h4" color="common.white">
          Activos Concurridos
        </Typography>
        <Stack direction="row" gap={1}>
          <IconButton
            className={`prev-arrow`}
            sx={{
              '&:disabled': {
                opacity: 0.5,
                cursor: 'default',
              },
              '&:hover': {
                bgcolor: 'transparent',
              },
            }}
            centerRipple
          >
            <IconifyIcon icon="mingcute:left-line" />
          </IconButton>
          <IconButton
            className={`next-arrow`}
            sx={{
              '&:disabled': {
                opacity: 0.5,
                cursor: 'default',
              },
              '&:hover': {
                bgcolor: 'transparent',
              },
            }}
            centerRipple
          >
            <IconifyIcon icon="mingcute:right-line" />
          </IconButton>
        </Stack>
      </Stack>
      <ReactSwiper
        onSwiper={setSwiperRef}
        sx={{
          height: 1,
        }}
      >
        {trendingItemsSlides.map((slideItem) => (
          <SwiperSlide key={slideItem.id}>
            <SlideActivoItem activoItem={slideItem} />
          </SwiperSlide>
        ))}
      </ReactSwiper>
    </Paper>
  );
};

export default Top5ActivosAhora;
