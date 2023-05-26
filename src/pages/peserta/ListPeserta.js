export const ListPeserta = ({ data, setMode, setSelectedPeserta, setKodePeserta, setIdEvent }) => {
    const tr = [];
    let id_event = '';
    let tim = '';
    let kategori = '';
    let bantalan = '';
    let target = '';
    let sesi = '';
    data.forEach((element, index) => {
        tr.push(
            <tr key={element.collection}>
                <td>{index+1}</td>
                <td>{id_event === element.id_event ? "" : element.event.label}</td>
                <td>{element.kode_peserta}</td>
                <td>{element.nama}</td>
                <td>{tim === element.tim ? "" : element.tim}</td>
                <td>{kategori === element.kategori ? "" : element.kategori}</td>
                <td>{element.bantalan}</td>
                <td>{element.target}</td>
                <td>{element.sesi}</td>
                <td>
                    <button onClick={() => onAksi('Ubah', element)} className="btn btn-sm btn-info m-1 px-3 text-white" data-bs-toggle="modal" data-bs-target="#pesertaModal">Ubah</button>
                    <button onClick={() => onAksi('Hapus', element)} className="btn btn-sm btn-danger m-1 px-3 text-white" data-bs-toggle="modal" data-bs-target="#pesertaModal">Hapus</button>
                </td>
            </tr>
        )
        id_event = element.id_event;
        tim = element.tim;
        kategori = element.kategori;
        bantalan = element.bantalan;
        target = element.target;
        sesi = element.sesi;
    })

    const onAksi = (mode, element) => {
        setMode(mode);
        setKodePeserta(element.kode_peserta);
        setIdEvent(element.id_event);
        setSelectedPeserta(element);
    }

    return (
        <div className="table-responsive">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Event</th>
                        <th>Kode Pegiat</th>
                        <th>Nama Pegiat</th>
                        <th>Nama Klub/Provinsi</th>
                        <th>Kategori</th>
                        <th>Bantalan</th>
                        <th>Target</th>
                        <th>Sesi</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {tr}
                </tbody>
            </table>
        </div>
    )
}