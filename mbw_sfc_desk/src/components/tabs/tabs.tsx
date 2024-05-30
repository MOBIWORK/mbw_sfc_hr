import { Tabs } from "antd";
import styled from "styled-components";

export const TabsCustom = styled(Tabs)`
  .ant-tabs-nav-list {
    padding-left: 16px;
    margin-bottom: -12px;
    margin-top: 8px;
    font-weight: 600;
    font-size: 12px;
    line-height: 22px;
  }
  .ant-tabs-nav .ant-tabs-tab {
    margin-right: 32px;
    color: #919eab; /* Màu của các tab không được chọn */
    text-decoration: none; /* Loại bỏ gạch chân */
  }

  .ant-tabs-nav .ant-tabs-tab-active {
    color: #1877f2; /* Giữ nguyên màu của tab được chọn (mặc định) */
    text-decoration: none; /* Loại bỏ gạch chân của tab được chọn */
  }

  .ant-tabs-nav .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #1877f2; /* Giữ nguyên màu của tab được chọn (mặc định) */
    text-decoration: none; /* Loại bỏ gạch chân của tab được chọn */
  }

  .ant-tabs-ink-bar.ant-tabs-ink-bar-animated {
    display: none !important;
  }
`;
