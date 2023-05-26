import moment from "moment";
import { useState } from "react";

export const ListEvent = ({ data, setMode, setSelectedEvent, setListKategori, setSelectedKategori, setSelectedIndexKategori }) => {

    const Kategori = ({ subelement, index, element }) => {
        return (
            <tr>
                <td>{subelement.nama_kategori}</td>
                <td>{subelement.max_rambahan}</td>
                <td>{subelement.max_arrow}</td>
                <td>{subelement.max_poin}</td>
                <td>{subelement.aduan} {subelement.aduan ? "peserta" : ""}</td>
                <td>
                    <button onClick={() => (onAksi('Ubah Kategori', element), setSelectedIndexKategori(index), setSelectedKategori(subelement))} className="btn btn-sm btn-info m-1 px-3 text-white" data-bs-toggle="modal" data-bs-target="#eventModal">Ubah Kategori</button>
                    <button onClick={() => (onAksi('Hapus Kategori', element), setSelectedIndexKategori(index), setSelectedKategori(subelement))} className="btn btn-sm btn-danger m-1 px-3 text-white" data-bs-toggle="modal" data-bs-target="#eventModal">Hapus Kategori</button>
                </td>
            </tr>
        )
    }

    const SubItem = ({ element, isExpanded }) => {
        return (
            isExpanded ?
                <>
                    <tr>
                        <th>Nama Kategori</th>
                        <th>Maksimum Seri</th>
                        <th>Maksimum Arrow</th>
                        <th>Maksimum Skor</th>
                        <th>Aduan</th>
                        <th>Aksi</th>
                    </tr>
                    {element.kategori ?
                        element.kategori.map((subelement, index) => (
                            <Kategori key={subelement.nama_kategori} subelement={subelement} index={index} element={element} />
                        ))
                        : null}
                </>
                : null
        )
    }

    const Item = ({ element }) => {
        const [isExpanded, setIsExpanded] = useState(false);

        const handleClick = () => {
            setIsExpanded(() => !isExpanded);
        };

        return (
            <>
                <tr>
                    <td><img width="100px" height="100px" src={process.env.REACT_APP_imageURL.replace('.php', '/') + element.logo} /></td>
                    <td><img width="100px" height="130px" src={process.env.REACT_APP_imageURL.replace('.php', '/') + element.poster} /></td>
                    <td>{element.nama_event}</td>
                    <td>{moment(element.tanggal_mulai.toDate()).format('DD MMM YYYY')}</td>
                    <td>{moment(element.tanggal_selesai.toDate()).format('DD MMM YYYY')}</td>
                    <td>
                        <div className="d-flex flex-column">
                            <button onClick={handleClick} className="btn btn-sm btn-info m-1 px-3 text-white">Lihat Kategori</button>
                            <button onClick={() => onAksi('Tambah Kategori', element)} className="btn btn-sm btn-info m-1 px-3 text-white" data-bs-toggle="modal" data-bs-target="#eventModal">Tambah Kategori</button>
                        </div>
                    </td>
                    <td>
                        <div className="d-flex flex-column">
                            <button onClick={() => onAksi('Ubah Event', element)} className="btn btn-sm btn-info m-1 px-3 text-white" data-bs-toggle="modal" data-bs-target="#eventModal">Ubah</button>
                            <button onClick={() => onAksi('Hapus Event', element)} className="btn btn-sm btn-danger m-1 px-3 text-white" data-bs-toggle="modal" data-bs-target="#eventModal">Hapus</button>
                            <button onClick={() => onAksi('Publish Event', element)} className="btn btn-sm btn-warning m-1 px-3 text-white" data-bs-toggle="modal" data-bs-target="#eventModal">{element.publish ? "Unpublish" : "Publish"}</button>
                        </div>
                    </td>
                </tr>

                <SubItem element={element} isExpanded={isExpanded} />
            </>
        )
    }

    const onAksi = (mode, element) => {
        setMode(mode);
        const data = { ...element }
        data.tanggal_mulai = moment(element.tanggal_mulai.toDate()).format('YYYY-MM-DD');
        data.tanggal_selesai = moment(element.tanggal_selesai.toDate()).format('YYYY-MM-DD');
        setSelectedEvent(data);
        if (mode === 'Tambah Kategori' || mode === 'Ubah Kategori' || mode === 'Hapus Kategori')
            setListKategori(element.kategori ? element.kategori : [])
    }

    return (
        <div className="table-responsive">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Logo</th>
                        <th>Poster</th>
                        <th>Nama Event</th>
                        <th>Tanggal Mulai</th>
                        <th>Tanggal Selesai</th>
                        <th>Kategori</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((element) => (
                        <Item key={element.collection} element={element} />
                    ))}
                </tbody>
            </table>
        </div>
    )
}