import React from "react";
import { Routes, Route } from "react-router-dom";
import Admin from "../pages/admin/Admin";

import Dashboard from "../pages/dashboard/Dashboard";
import NoPage from "../pages/nopage/NoPage";
import FormPoin from "../pages/poin/FormPoin";
import RankingIndividu from "../pages/ranking/RankingIndividu";
import RankingTim from "../pages/ranking/RankingTim";
import Login from "../pages/login/Login";
import DataPeserta from "../pages/peserta/DataPeserta";
import UbahPoin from "../pages/poin/UbahPoin";
import { AuthProvider } from "./useAuth";
import { RequireAuth } from "./RequireAuth";
import DataAdmin from "../pages/admin/DataAdmin";
import DataEvent from "../pages/event/DataEvent";
import DataPanitia from "../pages/panitia/DataPanitia";
import Rekapitulasi from "../pages/rekapitulasi/Rekapitulasi";
import Aduan from "../pages/aduan/Aduan";

export default function index() {

    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/peserta" element={<RequireAuth><DataPeserta /></RequireAuth>} />
                <Route path="/input-poin" element={<RequireAuth><FormPoin /></RequireAuth>} />
                <Route path="/ubah-poin" element={<RequireAuth><UbahPoin /></RequireAuth>} />
                <Route path="/ranking-individu" element={<RankingIndividu />} />
                <Route path="/ranking-tim" element={<RankingTim />} />
                <Route path="/admin" element={<RequireAuth><Admin /></RequireAuth>} />
                <Route path="/data-admin" element={<RequireAuth><DataAdmin /></RequireAuth>} />
                <Route path="/data-panitia" element={<RequireAuth><DataPanitia /></RequireAuth>} />
                <Route path="/data-event" element={<RequireAuth><DataEvent /></RequireAuth>} />
                <Route path="/aduan" element={<RequireAuth><Aduan /></RequireAuth>} />
                <Route path="/rakapitulasi" element={<RequireAuth><Rekapitulasi /></RequireAuth>} />
                <Route path="*" element={<NoPage />} />
            </Routes>
        </AuthProvider>
    );
}