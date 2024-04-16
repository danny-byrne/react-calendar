import { getClassNames } from "./Layout.classNames";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const classNames = getClassNames();
  return (
    <div className={classNames["Layout--appBody"]}>
      <div className={classNames["Layout--Header"]}>{title}</div>
      {children}
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
