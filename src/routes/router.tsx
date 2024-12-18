import { lazy, Suspense, ReactElement, PropsWithChildren } from 'react';
import { Outlet, RouteObject, /*RouterProps*/ createBrowserRouter } from 'react-router-dom';

import PageLoader from 'components/loading/PageLoader';
import Splash from 'components/loading/Splash';
import paths, { rootPaths } from './paths';
import ProtectedRoute from './ProtectedRoute';
const App = lazy<() => ReactElement>(() => import('App'));

const MainLayout = lazy<({ children }: PropsWithChildren) => ReactElement>(
  () => import('layouts/main-layout-admin/index'),
);

const MainLayoutSoporte = lazy<({ children }: PropsWithChildren) => ReactElement>(
  () => import('layouts/main-layout-soporte/index'),
);

const DashboardAdmin = lazy<() => ReactElement>(() => import('pages/dashboard/DashboardAdmin'));
const DashboardSoporteTecnico = lazy<() => ReactElement>(
  () => import('pages/dashboard/DashboardSoporteTecnico'),
);
const ErrorPage = lazy<() => ReactElement>(() => import('pages/error/ErrorPage'));
const LoginRegister = lazy<() => ReactElement>(() => import('pages/authentication/LoginRegister'));
const ChatBotPage = lazy<() => ReactElement>(() => import('pages/ia-chatbot/PageChatbotIA'));
const ViewDetalleProblema = lazy(() => import('components/sections/dashboard-soporte/detalle-problema/ViewDetalleProblema'));

const ViewMantenimientoData = lazy<() => ReactElement>(
  () => import('components/sections/dashboard-soporte/mantenimiento/ViewMantenimientoData'),
);
const AuditoriaPage = lazy<() => ReactElement>(
  () => import('../components/sections/resource-share/auditorias/ViewAuditoriaData'),
);
const PageUserProfile = lazy<() => ReactElement>(
  () => import('../components/sections/pages-user/PageLoadingProfile'),
);

const ViewDataUsuarioPersonal = lazy<() => ReactElement>(
  () =>
    import(
      '../components/sections/dashboard-admin/gestionar-user-personal/ViewDataUsuarioPersonal'
    ),
);

const ViewOptions = lazy(
  () => import('components/sections/resource-share/options-search-historial/ViewOptions'),
);

const ViewOptionsConfig = lazy(
  () => import('components/sections/configuration-admin/ViewOptionsConfig'),
);

const ViewSeguimientoProblema = lazy(
  () =>
    import('components/sections/dashboard-soporte/seguimiento-problema/ViewSeguimientoProblema'),
);

const routes: RouteObject[] = [
  {
    element: (
      <Suspense fallback={<Splash />}>
        <App />
      </Suspense>
    ),
    children: [
      {
        path: paths.home,
        children: [
          {
            index: true,
            element: <LoginRegister />,
          },
        ],
      },
      {
        path: paths.login,
        children: [
          {
            index: true,
            element: <LoginRegister />,
          },
        ],
      },
      {
        path: paths.register,
        children: [
          {
            index: true,
            element: <LoginRegister />,
          },
        ],
      },
      {
        /* Ruta protegida para el usuario admin */
        element: <ProtectedRoute allowedRoles={['ADMIN', 'adminuser']} />,
        path: rootPaths.adminRoot,
        children: [
          {
            element: (
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <Outlet />
                </Suspense>
              </MainLayout>
            ),
            children: [
              {
                index: true,
                element: <DashboardAdmin />,
              },
              {
                path: paths.configAdmin,
                element: <ViewOptionsConfig />,
              },
              {
                path: paths.historialAdmin,
                element: <ViewOptions />,
              },
              {
                path: paths.chatbotiaAdmin,
                element: <ChatBotPage />,
              },
              {
                path: paths.profileAdmin,
                element: <PageUserProfile />,
              },
              {
                path: paths.mantenimientoAdmin,
                element: <ViewMantenimientoData />,
              },
              {
                path: paths.auditoriaAdmin,
                element: <AuditoriaPage />,
              },
              {
                path: paths.gestionar,
                element: <ViewDataUsuarioPersonal />,
              },
            ],
          },
        ],
      },

      {
        /* Ruta protegida para el usuario soporte tecnico */
        element: <ProtectedRoute allowedRoles={['SOPORTE_TECNICO', 'adminuser']} />,
        path: rootPaths.soporteRoot,
        children: [
          {
            element: (
              <MainLayoutSoporte>
                <Suspense fallback={<PageLoader />}>
                  <Outlet />
                </Suspense>
              </MainLayoutSoporte>
            ),
            children: [
              {
                index: true,
                element: <DashboardSoporteTecnico />,
              },
              {
                path: paths.seguimiento,
                element: <ViewSeguimientoProblema />,
              },
              {
                path: paths.detalleProblema,
                element: <ViewDetalleProblema />,
              },
              {
                path: paths.mantenimiento,
                element: <ViewMantenimientoData />,
              },
              {
                path: paths.auditoriaSoporte,
                element: <AuditoriaPage />,
              },
              {
                path: paths.historialSoporte,
                element: <ViewOptions />,
              },
              {
                path: paths.profileSoporte,
                element: <PageUserProfile />,
              },
            ],
          },
        ],
      },
      {
        path: '*',
        element: <ErrorPage />,
      },
    ],
  },
];

const options: { basename: string; future: { v7_partialHydration: boolean } } = {
  basename: '/',
  future: {
    v7_partialHydration: true,
  },
};

// const router: Partial<RouterProps> = createBrowserRouter(routes, options);
const router = createBrowserRouter(routes, options);

export default router;
