import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export function AdminRoute({ children }) {
    const userInfo = useSelector((state) => state.user.userInfo);

    if (!userInfo || userInfo.role !== "admin") {
        return <Navigate to="/403" replace />;
    }

    return <>{children}</>;
}
