import { Tabs } from "antd";
import styled from "styled-components";

export const TabsCustom = styled(Tabs)`
  .ant-tabs-nav-wrap {
    background: #F4F6F8;
    padding-bottom: 8px;
    margin-bottom: -16px;
  }
  .ant-tabs-tab ant-tabs-tab-active {
    padding-top: 8px;
    padding-bottom: 8px;
  }
  .ant-tabs-tab-btn {
    font-size: 12px;
  }
  .ant-tabs-nav-list {
    padding-left: 16px;
    margin-bottom: -12px;
    font-weight: 600;
    font-size: 12px;
    line-height: 22px;
  }
  .ant-tabs-nav .ant-tabs-tab {
    margin-left: 16px;
    margin-right: 16px;
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
