export const ListPanitia = ({ data, setMode, setSelectedPanitia }) => {
    const tr = [];
    data.forEach((element, index) => {
        tr.push(
            <tr key={element.collection}>
                <td>{element.event.label}</td>
                <td>{element.email}</td>
                <td>{element.nama}</td>
                <td>
                    <button onClick={() => onAksi('Ubah', element)} className="btn btn-sm btn-info m-1 px-3 text-white" data-bs-toggle="modal" data-bs-target="#panitiaModal">Ubah</button>
                    <button onClick={() => onAksi('Hapus', element)} className="btn btn-sm btn-danger m-1 px-3 text-white" data-bs-toggle="modal" data-bs-target="#panitiaModal">Hapus</button>
                </td>
            </tr>
        )
    })

    const onAksi = (mode, element) => {
        setMode(mode);
        setSelectedPanitia(element);
    }

    return (
        <div className="table-responsive">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Event</th>
                        <th>Email</th>
                        <th>Nama</th>
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