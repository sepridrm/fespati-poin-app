export const ListAdmin = ({ data, setMode, setSelectedAdmin }) => {
    const tr = [];
    data.forEach((element, index) => {
        tr.push(
            <tr key={element.collection}>
                <td>{element.email}</td>
                <td>{element.nama}</td>
                <td>{element.role}</td>
                <td>
                    <button onClick={() => onAksi('Ubah', element)} className="btn btn-sm btn-info m-1 px-3 text-white" data-bs-toggle="modal" data-bs-target="#adminModal">Ubah</button>
                    <button onClick={() => onAksi('Hapus', element)} className="btn btn-sm btn-danger m-1 px-3 text-white" data-bs-toggle="modal" data-bs-target="#adminModal">Hapus</button>
                </td>
            </tr>
        )
    })

    const onAksi = (mode, element) => {
        setMode(mode);
        setSelectedAdmin(element);
    }

    return (
        <div className="table-responsive">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Nama</th>
                        <th>Role</th>
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