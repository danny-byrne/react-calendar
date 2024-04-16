import { getClassNames } from "./Layout.classNames";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const classNames = getClassNames();
  return (
    <div className={classNames["Layout--appBody"]}>
      <div className={classNames["Layout--Header"]}>Learn Recurrence Rules</div>
      {children}
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
