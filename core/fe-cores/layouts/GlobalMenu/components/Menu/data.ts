const menuData = [
  {
    key: "/home",
    label: "Trang chủ",
    // icon: <HomeOutlined />,
    link: "/home",
  },
  {
    key: "/manage-booking",
    label: "Quản lý đặt chỗ",
    // icon: <BorderHorizontalOutlined />,
    children: [
      { key: "/booking", label: "Đặt chỗ", link: "/booking" },
      {
        key: "/booking-list",
        label: "Danh sách đặt chỗ",
        link: "/booking-list",
      },
      { key: "/ticketing", label: "Nghiệp vụ vé", link: "/ticketing" },
      { key: "/stuffed", label: "Nhồi booking", link: "/stuffed" },
    ],
  },
  {
    key: "/crawler",
    label: "Quản lý cào dữ liệu",
    // icon: <BorderHorizontalOutlined />,
    children: [
      { key: "/config", label: "Cấu hình cào dữ liệu", link: "/crawler/config" },
      {
        key: "/comic-data",
        label: "Danh dữ liệu",
        link: "/crawler/comic-data",
      },
      {
        key: "/crawled-comic",
        label: "Danh sách đã cào",
        link: "/crawler/crawled-comic",
      }
    ],
  },
  {
    key: "/comic",
    label: "Pax info",
    children: [
      { key: "/comic/list", label: "Danh sách truyện", link: "/comic/list" },
      { key: "/comment/list", label: "Danh sách bình luận", link: "/comment/list" },
    ],
  },
  {
    key: "/accountant",
    label: "Kế toán",
    // icon: <PieChartOutlined />,
    link: "/accountant",
  },
  {
    key: "/setting",
    label: "Cài đặt",
    // icon: <SettingOutlined />,
    link: "/setting",
  },
  {
    key: "/config",
    label: "Cấu hình",
    // icon: <AppstoreOutlined />,
    link: "/config",
  },
];
