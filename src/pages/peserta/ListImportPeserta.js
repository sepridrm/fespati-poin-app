export const ListImportPeserta = ({ data }) => {
    const tr = [];
    data.forEach((element, index) => {
        if (index > 0)
            tr.push(
                <tr key={element[1]}>
                    <td>{element[0]}</td>
                    <td>{element[1]}</td>
                    <td>{element[2]}</td>
                    <td>{element[3]}</td>
                    <td>{element[4]}</td>
                    <td>{element[5]}</td>
                    <td>{element[6]}</td>
                    <td>{element[7]}</td>
                </tr>
            )
    })

    return (
        <div className="table-responsive">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Kode Pegiat</th>
                        <th>Nama Pegiat</th>
                        <th>Klub/Provinsi</th>
                        <th>Kategori</th>
                        <th>Bantalan</th>
                        <th>Target</th>
                        <th>Sesi</th>
                    </tr>
                </thead>
                <tbody>
                    {tr}
                </tbody>
            </table>
        </div>
    )
}