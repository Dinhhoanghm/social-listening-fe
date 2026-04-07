# Core Library — Giải thích kiến trúc

Thư mục `/core` chứa thư viện dùng chung (shared library) cho toàn bộ ứng dụng frontend. Nó cung cấp nền tảng Redux, hệ thống layout, giao diện, tiện ích và các module tính năng tái sử dụng được. Ứng dụng chính không tự xây dựng các thành phần này mà **import và cấu hình lại** từ đây.

---

## Cấu trúc tổng quan

```
core/
├── fe-base/               # Tầng nền: Redux store, API layer, auth actions
├── fe-cores/              # Tầng khung: layout, reducers, hooks, components UI
├── fe-global/             # Dịch vụ toàn cục: theme, assets, i18n, storage, cookie
├── fe-module-auth/        # Module xác thực người dùng
├── fe-module-crawler/     # Module quản lý crawler
├── fe-component/          # Bộ component UI tái sử dụng
└── fe-general-settings/   # Module cài đặt hệ thống (user, role, branch, position)
```

---

## 1. `fe-base` — Tầng nền (Foundation Layer)

Cung cấp cấu hình Redux store và API layer dùng chung cho toàn app.

### `fe-base/apis/`

File chính: `apis/index.ts`

Khởi tạo instance RTK Query (`baseApi`) dùng chung cho toàn app. Mọi module khác đều inject endpoint vào instance này thay vì tạo API riêng.

**Cơ chế hoạt động:**
- `baseUrl` lấy từ `process.env.URL_SERVER`
- Tự động gắn header `Authorization: Bearer <token>` và `space-id` vào mỗi request
- Xử lý lỗi `401`: dispatch action `AUTH_ACTION.EXPIRED` để mở modal hết phiên
- Xử lý lỗi `403`: tự động gọi refresh token (dùng `async-mutex` để tránh race condition khi nhiều request cùng fail), sau đó retry request gốc

**Các helper tạo endpoint:**

| Hàm | Loại | HTTP Method | Mô tả |
|-----|------|-------------|-------|
| `getBaseApi(url, builder)` | query | GET | Truy vấn dữ liệu, truyền params qua query string |
| `postBaseApi(url, builder)` | mutation | POST | Tạo/tìm kiếm dữ liệu, body là JSON |
| `putBaseApi(url, builder)` | mutation | PUT | Cập nhật toàn bộ, body + optional params |
| `patchBaseApi(url, builder)` | mutation | PATCH | Cập nhật một phần |
| `deleteBaseApi(url, builder)` | mutation | DELETE | Xóa dữ liệu qua query params |
| `createEndpoints(url, name, builder)` | — | Tất cả | Sinh ra đủ 5 endpoint CRUD cho một resource |

Tất cả endpoint đều tự động `transformResponse` để extract `.data` từ response `{ code, message, data }`.

**Interface `SearchBody`** — chuẩn tìm kiếm phân trang:
```typescript
{
  page: number;
  pageSize: number;
  keyword: string;
  filters: { name, operation, value }[];
  sorts?: { property, direction }[];
}
```

### `fe-base/reducers/`

Cung cấp factory để tạo Redux store.

| File | Xuất ra | Tác dụng |
|------|---------|----------|
| `store.ts` | `store(reducer, middleware)` | Factory tạo Redux store với `configureStore` |
| `rootReducer.ts` | `createReducer(extraReducers)` | `combineReducers` đã gộp sẵn `baseApi.reducer` |
| `middleware.ts` | `middleware(arr)` | Gộp Redux Logger + mảng middleware truyền vào |
| `providers.tsx` | `ProviderRedux` | React `<Provider>` bọc app với store |

**Cách sử dụng điển hình:**
```typescript
// app/stores/rootReducer.ts
const reducer = createReducer({ app: appReducer, tab: tabReducer });

// app/stores/middleware.ts
const _middleware = middleware([baseApi.middleware]);

// app/stores/store.ts
const reduxStore = store(reducer, _middleware);
```

### `fe-base/actions/`

Định nghĩa các action type cho luồng xác thực:

```typescript
AUTH_ACTION = {
  EXPIRED: 'auth/loginExpired',      // Token hết hạn, không thể refresh
  TOKEN_RECEIVED: 'auth/tokenReceived', // Nhận được token mới sau refresh
  LOGOUT: 'auth/logout'              // Người dùng đăng xuất
}
```

### `fe-base/utils/`

Các hàm trích xuất state dùng trong `prepareHeaders` của baseApi:
- `getToken(state)` — lấy JWT từ cookie hoặc Redux state
- `getRefreshToken(state)` — lấy refresh token
- `getSpaceIdSelected(state)` — lấy ID không gian làm việc đang chọn

---

## 2. `fe-cores` — Tầng khung ứng dụng (App Framework Layer)

Cung cấp toàn bộ shell của ứng dụng: layout, điều hướng, state quản lý màn hình, hooks tiện ích.

### `fe-cores/layouts/`

Hệ thống layout đa chế độ cho admin panel.

**Component trung tâm: `LayoutBase`**

Đây là wrapper bọc toàn bộ giao diện. Nhận props:
- `layoutMode`: chế độ hiển thị
- `collapsedSider`: trạng thái thu gọn sidebar
- `footer`: config footer
- `isPageTab`: có hiển thị tab điều hướng không
- `AccountComponent`: component tài khoản ở header

**4 chế độ layout (`ThemeLayoutMode`):**

| Chế độ | Mô tả |
|--------|-------|
| `vertical` | Sidebar dọc bên trái, header ngang trên |
| `horizontal` | Menu ngang hoàn toàn, không có sidebar |
| `vertical-mix` | Sidebar icon + menu mở rộng khi hover |
| `horizontal-mix` | Sidebar icon + menu ngang trên header |

**Các component con trong layout:**

| Component | Vị trí | Tác dụng |
|-----------|--------|----------|
| `GlobalHeader` | Top | Header ngang: logo, menu toggler, breadcrumb, công cụ theme/fullscreen, tài khoản |
| `GlobalSider` | Left | Sidebar: logo + menu container |
| `GlobalMenu` | Trong Sider/Header | Render menu theo chế độ layout, highlight active route |
| `GlobalTab` | Dưới Header | Tab điều hướng dạng browser tab, cho phép đóng/thêm tab |
| `GlobalBreadcrumb` | Trong Header | Breadcrumb tự động từ route hiện tại |
| `GlobalLogo` | Trong Sider/Header | Logo ứng dụng, thu gọn khi sidebar collapse |

**Hook `useLayoutBase()`** — đọc config layout từ Redux:
```typescript
const { layoutMode, collapsedSider, footer, isPageTab } = useLayoutBase();
```

### `fe-cores/reducers/`

Redux slices quản lý trạng thái giao diện.

**`app` slice** — Trạng thái toàn bộ layout:

```typescript
interface APP_STATE {
  layoutMode: ThemeLayoutMode;
  header: { title, showTitle, showLogo, logo, logoCompact, heightLogo, headerHeight };
  sider: { showSider, inverted, collapsedSider, collapsedWidth, width, darkMode };
  memu: { showMenuToggler, showMenu, items: MenuItem[] };
  pageTab: { isPageTab };
  footer: { showFooter, height };
  isMobile: boolean;
  theme: "light" | "dark";
  rootRoute: string;
}
```

Actions quan trọng: `setAppConfig`, `setLayoutMode`, `setCollapsedSider`, `setItemsMenu`, `setTheme`, `setIsMobile`

**`tab` slice** — Quản lý page tabs:
- State: danh sách tabs, active tab ID, home tab
- Actions: `addTab`, `removeTab`, `setActiveTabId`, `changeTabLabel`
- Thunks: `initTabStore()`, `addTabByRoute()` — tự động thêm tab khi điều hướng

### `fe-cores/components/`

| Component | Tác dụng |
|-----------|----------|
| `AppConfigProvider` | Nhận config (`APP_STATE`) → dispatch `setAppConfig` vào Redux, hiện loading spinner trong lúc khởi tạo |
| `MessageProvider` | Cung cấp `useMessage()` hook — bọc Ant Design `message.useMessage()` |
| `ThemeConfiguration` | Drawer cài đặt: chọn layout mode, bật dark sider |
| `ChangeTheme` | Nút bật/tắt light/dark mode |
| `FullScreen` | Nút bật/tắt fullscreen |
| `ReloadPage` | Nút tải lại trang |
| `WindowSizeProvider` | Context cung cấp kích thước cửa sổ |

**Sử dụng `AppConfigProvider` trong layout root:**
```tsx
// app/layout.tsx
<AppConfigProvider config={appConfig}>
  {children}
</AppConfigProvider>
```

### `fe-cores/hooks/`

| Hook | Tác dụng |
|------|----------|
| `useResponsivePadding()` | Trả về giá trị padding theo breakpoint hiện tại (xxl→xl→lg→md→sm→xs) |
| `useHeightContent()` | Tính chiều cao vùng content trừ đi header + tab + footer |
| `useWindowSize()` | Theo dõi `window.innerWidth` và `window.innerHeight` |
| `useHookFilter()` | Logic filter/search cho bảng dữ liệu |
| `useApiMutation()` | Wrapper RTK Query mutation — tự động hiện message thành công/lỗi |

### `fe-cores/constants/`

Hằng số và kiểu dữ liệu cho layout:

```typescript
type ThemeLayoutMode = "vertical" | "horizontal" | "vertical-mix" | "horizontal-mix"

interface MenuItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  link: string;           // Route đích khi click menu
  children?: MenuItem[];
}

HEADER_HEIGHT = 64        // px
SIDER_WIDTH = 280         // px
SIDER_COLLAPSED_WIDTH = 80
PAGE_TAB_HEIGHT = 44
```

### `fe-cores/common/`

Logic tái sử dụng cho bảng dữ liệu:
- `useHookTable()` — hook hoàn chỉnh: tìm kiếm, phân trang, chọn hàng, auto-refresh
- `useTableScroll()` — tính `scroll.y` cho `<Table>` Ant Design

---

## 3. `fe-global` — Dịch vụ toàn cục (Global Services)

### `fe-global/themes/`

**`ThemeProvider`** — Bọc `ConfigProvider` của Ant Design với khả năng chuyển theme:
- Đọc theme từ `localStorage` khi khởi động
- Nếu không có trong localStorage: tự động theo giờ (18h–6h = dark, còn lại = light)
- Lưu thay đổi vào `localStorage`
- Hợp nhất (merge) theme config tùy chỉnh với theme hệ thống
- Expose `useTheme()` hook: `{ mode, toggleTheme }`

Cách dùng:
```tsx
<ThemeProvider theme={themeConfig}>
  {children}
</ThemeProvider>
```

### `fe-global/assets/`

Export fonts, icon và hình ảnh:
- `fonts`: Next.js font loader (Open Sans, Tomorrow, v.v.)
- `icons`: Tập hợp icon từ `@ant-design/icons`
- `images`: Đường dẫn hình ảnh tĩnh

### `fe-global/language/`

Cấu hình `i18next` cho đa ngôn ngữ:
- Ngôn ngữ mặc định: `vi` (tiếng Việt)
- Tự động phát hiện ngôn ngữ trình duyệt
- Tải file dịch qua HTTP backend

### `fe-global/storage/`

Abstraction layer cho lưu trữ đa nền tảng:
- `async-storage.ts`: Wrapper React Native AsyncStorage (cho mobile)
- Tự động serialize/deserialize JSON, hỗ trợ kiểu `Date`

### `fe-global/cookies/`

Tiện ích quản lý cookie (dùng `cookies-next`).

### `fe-global/utils/`

| Hàm | Tác dụng |
|-----|----------|
| `formatNumberModern(num)` | Format số với dấu phân cách hàng nghìn |
| `stringJson(input)` | Thao tác chuỗi JSON |
| `hexToRgba(hex, alpha)` | Chuyển màu HEX sang RGBA |

---

## 4. `fe-module-auth` — Module Xác thực

Xử lý đăng nhập, quản lý token và thông tin người dùng.

### `fe-module-auth/apis/`

RTK Query endpoints cho authentication:

| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `postLogin` | POST | Đăng nhập với username/password |
| `getMeAuth` | GET | Lấy thông tin user hiện tại |
| `changePassword` | PUT | Đổi mật khẩu |
| `updateMeAuth` | PUT | Cập nhật profile (avatar, họ tên, email, SĐT) |

### `fe-module-auth/reducers/`

Redux slice quản lý trạng thái xác thực:

```typescript
state = { token: string, me: UserProfile, expired: boolean }
```

| Action/Event | Kết quả |
|-------------|---------|
| `setToken(token)` | Cập nhật JWT token |
| `AUTH_ACTION.EXPIRED` | `expired = true` → mở modal thông báo hết phiên |
| `AUTH_ACTION.TOKEN_RECEIVED` | Cập nhật token mới sau khi refresh |
| `AUTH_ACTION.LOGOUT` | Reset về trạng thái ban đầu |
| `getMeAuth.fulfilled` | Lưu profile user vào `me` |

Selectors: `getToken()`, `getMe()`, `getExpired()`

### `fe-module-auth/components/`

| Component | Tác dụng |
|-----------|----------|
| `FormLogin` | Form đăng nhập (username + password) |
| `LoginExpired` | Modal thông báo phiên hết hạn, điều hướng về trang login |
| `Account` | Dropdown tài khoản ở header: avatar, tên, đổi mật khẩu, đăng xuất |
| `PasswordChange` | Modal đổi mật khẩu |
| `ProfileModal` | Modal xem/cập nhật thông tin cá nhân |

---

## 5. `fe-module-crawler` — Module Web Crawler

Dành riêng cho nghiệp vụ quản lý cấu hình crawler và dữ liệu thu thập.

### `fe-module-crawler/apis/`

Chia thành 3 API service:

**`crawlerConfigApi`** — Quản lý cấu hình crawler:
- `searchCrawlerConfig`, `getCrawlerConfigDetail`
- `addCrawlerConfig`, `updateCrawlerConfig`
- `deleteCrawlerConfig`, `multiDeleteCrawlerConfig`
- `selectCrawlerConfig` — lấy danh sách dropdown

**`comicDataApi`** — Quản lý dữ liệu truyện:
- CRUD đầy đủ cho `ComicData`

**`crawledComicApi`** — Quản lý dữ liệu đã crawl:
- `searchCrawledComic`, `updateCrawledComic`
- `searchCrawledComicMetadata`, `updateCrawledComicMetadata`
- `unlockCrawledComic`, `unlockCrawledComicChapter`

### `fe-module-crawler/constants/`

**`type.ts`** — Các kiểu dữ liệu cốt lõi:

```typescript
interface ItemPath {
  locatorType: "css" | "xpath";  // Loại selector
  locatorValue: string;           // Giá trị selector
  attribute?: string;             // Thuộc tính HTML cần lấy
  parserScript?: string;          // Script xử lý dữ liệu sau khi lấy
}

interface ApiTemplateDTO {
  method: "GET" | "POST";
  fieldPage: string;              // Tên trường phân trang
  params: Record<string, any>;
  headers: Record<string, string>;
  urls: string[];
}

interface CrawlerConfig {
  // Thông tin cơ bản
  name, url, frequency, type: "WEB" | "API"
  
  // Cho WEB crawler: các ItemPath cho từng phần tử
  itemPath, titlePath, imageUrlPath, detailUrlPath, nextPagePath
  
  // Cho API crawler
  listApiTemplate, detailApiTemplate, chaptersApiTemplate, pagesApiTemplate
}
```

### `fe-module-crawler/components/`

21 component UI cho nghiệp vụ crawler, bao gồm:
- Bảng quản lý config, dữ liệu truyện, chapter đã crawl
- Form tạo/sửa cấu hình (bao gồm CSS/XPath selector, API template)
- Nút test crawler và modal hiển thị kết quả test
- Modal xác nhận xóa

---

## 6. `fe-component` — Thư viện Component UI

Các wrapper tùy chỉnh trên Ant Design cho phù hợp với ứng dụng.

| Component | Dựa trên | Cải tiến |
|-----------|----------|----------|
| `ATable` | `Table` (antd) | Thêm component empty state tùy chỉnh |
| `AModal` | `Modal` (antd) | Max height/width + scroll, centered, padding chuẩn |
| `AEmpty` | `Empty` (antd) | Style riêng cho trạng thái trống |
| `ATreeSelect` | `TreeSelect` (antd) | Wrapper với style tùy chỉnh |

---

## 7. `fe-general-settings` — Module Cài đặt Hệ thống

Các module quản lý cấu hình hệ thống, mỗi module có đủ APIs + Components + Constants.

| Module | Tác dụng |
|--------|----------|
| `fe-module-user` | Quản lý người dùng: tạo, sửa, xóa, gán quyền |
| `fe-module-rbac` | Quản lý vai trò và phân quyền (Role-Based Access Control) |
| `fe-module-position` | Quản lý chức vụ/vị trí trong tổ chức |
| `fe-module-branch` | Quản lý chi nhánh/phòng ban trong tổ chức |

---

## Sơ đồ phụ thuộc giữa các module

```
fe-general-settings ──┐
fe-module-auth ───────┤
fe-module-crawler ────┤
                      ↓
              fe-cores (layouts, hooks, reducers)
                      ↓
              fe-base (store, API layer, actions)
                      ↑
              fe-global (theme, assets, i18n)
```

- **`fe-global`**: Không phụ thuộc module nào khác trong core
- **`fe-base`**: Chỉ phụ thuộc `fe-global` (token từ cookies)
- **`fe-cores`**: Phụ thuộc `fe-base` (baseApi, store) và `fe-global` (theme)
- **Các module tính năng**: Phụ thuộc `fe-base` (API) và `fe-cores` (layout, hooks)

---

## Cách ứng dụng tích hợp core

### 1. Thiết lập Redux Store

```typescript
// app/stores/rootReducer.ts — kết hợp baseApi của ứng dụng + app/tab reducer từ core
const reducer = combineReducers({
  [myBaseApi.reducerPath]: myBaseApi.reducer,
  app: appReducer,   // từ fe-cores/reducers
  tab: tabReducer,   // từ fe-cores/reducers
});

// app/stores/middleware.ts
const _middleware = middleware([myBaseApi.middleware]); // middleware từ fe-base/reducers

// app/stores/store.ts
const reduxStore = store(reducer, _middleware); // store factory từ fe-base/reducers
```

### 2. Thiết lập Provider trong Root Layout

```tsx
// app/layout.tsx
<AntdRegistry>
  <ThemeProvider theme={themeConfig}>     {/* fe-global/themes */}
    <MessageProvider>                      {/* fe-cores/components */}
      <ProviderRedux>                      {/* app/stores/providers */}
        <AppConfigProvider config={appConfig}> {/* fe-cores/components */}
          {children}
        </AppConfigProvider>
      </ProviderRedux>
    </MessageProvider>
  </ThemeProvider>
</AntdRegistry>
```

### 3. Cấu hình ứng dụng (`appConfig`)

```typescript
// app/appConfig.ts
export const appConfig: APP_STATE = {
  layoutMode: "vertical",
  header: { title: "Tên app", showLogo: true, logo: "/logo.png", ... },
  sider: { width: 260, collapsedSider: false, ... },
  memu: { items: [] },   // Menu sẽ được set sau qua dispatch(setItemsMenu(...))
  rootRoute: "/home",
  theme: "light",
  ...
};
```

### 4. Layout Route Group

```tsx
// app/(main-template)/layout.tsx
export default function LayoutRoot({ children }) {
  const dispatch = useDispatch();
  const { layoutMode, collapsedSider, footer, isPageTab } = useLayoutBase(); // fe-cores/layouts
  const padding = useResponsivePadding();  // fe-cores/hooks

  useLayoutEffect(() => {
    dispatch(setItemsMenu(menuItems));  // fe-cores/reducers
  }, []);

  return (
    <LayoutBase layoutMode={layoutMode} ...> {/* fe-cores/layouts */}
      <Flex vertical style={{ padding }}>
        {children}
      </Flex>
    </LayoutBase>
  );
}
```

### 5. Inject API Endpoints vào baseApi

```typescript
// lib/store/apis/crawlerApi.ts
export const crawlerApi = myBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchConfigs: builder.query({ ... }),
    addConfig: builder.mutation({ ... }),
  }),
});
```

> **Lưu ý**: Ứng dụng này KHÔNG sử dụng `fe-module-auth`, `fe-general-settings` và cơ chế phân quyền. Menu được định nghĩa tĩnh thay vì lấy từ API.
