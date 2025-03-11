"use client";

import { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";

const LoginPage = () => {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: 로그인 api 호출 로직
    };

    return (
        <Container maxWidth="xs" sx={{backgroundColor:'#fcc'}}>
            <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
                <Box>
                    로고 이미지 들어갈 자리
                </Box>
                <form onSubmit={handleLogin} style={{ width: "100%" }}>
                    <TextField
                        label="ID"
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        placeholder={'Enter your ID'}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        placeholder={'Enter your Password'}
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        로그인
                    </Button>
                </form>
            </Box>
            <Typography textAlign={'center'}>Copyright. EasyC All right reserved.</Typography>
        </Container>
    );
};

export default LoginPage;