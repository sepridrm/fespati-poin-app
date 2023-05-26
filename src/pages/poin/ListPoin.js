export const ListPoin = ({ data, setMode, setSelectedSkorPeserta, kategori }) => {
    const tr = [];
    const th = [];
    let total_skor = 0;
    let total_skor_max3 = 0;
    let total_skor_max2 = 0;
    let total_skor_max1 = 0;

    data.forEach((element, index) => {
        const skorList = []
        for (let p = 0; p < element.data.length; p++) {
            skorList.push(
                <td key={"skor-" + index + "-" + p}>{element.data[p].skor}</td>
            )

            if (th.length < element.data.length)
                th.push(
                    <th key={"th-" + index + "-" + p}>A{p + 1}</th>
                )
        }


        tr.push(
            <tr key={element.collection}>
                <td>{"   "}{element.rambahan}</td>
                {skorList}
                <td>{element.total_skor_rambahan}</td>
                <td>{element.skor_max1}</td>
                <td>{element.skor_max2}</td>
                <td>{element.skor_max3}</td>
                <td>
                    <button onClick={() => onAksi('Ubah', element)} className="btn btn-sm btn-info m-1 px-3 text-white" data-bs-toggle="modal" data-bs-target="#pesertaModal">Ubah</button>
                    {/* {index > 6 ? */}
                    <button onClick={() => onAksi('Hapus', element)} className="btn btn-sm btn-danger m-1 px-3 text-white" data-bs-toggle="modal" data-bs-target="#pesertaModal">Hapus</button>
                    {/* : null} */}
                </td>
            </tr>
        )

        total_skor = total_skor + element.total_skor_rambahan;
        total_skor_max3 = total_skor_max3 + element.skor_max3;
        total_skor_max2 = total_skor_max2 + element.skor_max2;
        total_skor_max1 = total_skor_max1 + element.skor_max1;

        if (data.length - 1 === index) {
            tr.push(
                <tr key={index}>
                    <th colSpan={1 + element.data.length}></th>
                    <th style={{ backgroundColor: 'red' }}>{total_skor}</th>
                    <th style={{ backgroundColor: 'yellow' }}>{total_skor_max1}</th>
                    <th style={{ backgroundColor: 'yellow' }}>{total_skor_max2}</th>
                    <th style={{ backgroundColor: 'yellow' }}>{total_skor_max3}</th>
                    <th style={{ backgroundColor: 'yellow' }}></th>
                </tr>
            )
        }
    })

    const onAksi = (mode, element) => {
        setMode(mode)
        setSelectedSkorPeserta(element)
    }

    return (
        <div className="table-responsive">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Seri</th>
                        {th}
                        <th>Skor Seri</th>
                        <th>Skor {kategori.max_poin}</th>
                        <th>Skor {kategori.max_poin - 1}</th>
                        <th>Skor {kategori.max_poin - 2}</th>
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