import { useEffect } from "react";
import { useLogout } from "../../hooks/useLogout";
 

export const LogoutPage = () => {
    const handleLogout = useLogout();

    useEffect(() => {
        handleLogout();
    }, [handleLogout]);

    return <h1>Logging out...</h1>;
};
