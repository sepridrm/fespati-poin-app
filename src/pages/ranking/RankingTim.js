import { useEffect, useState } from 'react';
import Select from 'react-select';
import { getKategori } from '../../utils/helpers';
import jsPDF from "jspdf";
import "jspdf-autotable";
import { downloadExcel } from 'react-export-table-to-excel';
import { UseAuth } from '../../routes/useAuth';

const RankingTim = (props) => {
    const [ListKategori, setListKategori] = useState([]);
    const [ListSearch, setListSearch] = useState([]);
    const [list, setList] = useState([]);
    const [selectedKategori, setSelectedKategori] = useState("");
    const [search, setSearch] = useState('');
    const selected_event = props.selected_event
    const data = props.data

    const auth = UseAuth()

    useEffect(() => {
        grupSkor(data);
    }, [data])

    const groupBy = function (xs, key) {
        return xs.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };

    Array.prototype.sum = function (prop) {
        var total = 0
        for (var i = 0, _len = this.length; i < _len; i++) {
            total += this[i][prop]
        }
        return total
    }

    function compareFn(a, b) {
        if (a.total_skor < b.total_skor) {
            return 1;
        }
        if (a.total_skor > b.total_skor) {
            return -1;
        }
        if (a.total_skor == b.total_skor) {
            if (a.total_skor_max1 < b.total_skor_max1) {
                return 1;
            }
            if (a.total_skor_max1 > b.total_skor_max1) {
                return -1;
            }
            return 0;
        }
        return 0;
    }

    const grupSkor = (data) => {
        const grupKategori = groupBy(data, 'kategori');
        const arrKategori = [];
        const listKategori = [];
        Object.keys(grupKategori).forEach((elementKat, index) => {
            let nodes = [];
            const grupPeserta = groupBy(grupKategori[elementKat], 'tim');

            Object.keys(grupPeserta).forEach(elementTim => {
                let total_r1 = 0;
                let total_r2 = 0;
                let total_r3 = 0;
                let total_r4 = 0;
                let total_r5 = 0;
                let total_r6 = 0;
                let total_r7 = 0;
                let total_r8 = 0;
                let total_r9 = 0;
                let total_r10 = 0;

                grupPeserta[elementTim].forEach(elementPeserta => {
                    // console.log(elementTim, elementPeserta.rambahan, elementPeserta.total_skor_rambahan);

                    total_r1 = elementPeserta.rambahan === 1 ? total_r1 + elementPeserta.total_skor_rambahan : total_r1 + 0
                    total_r2 = elementPeserta.rambahan === 2 ? total_r2 + elementPeserta.total_skor_rambahan : total_r2 + 0
                    total_r3 = elementPeserta.rambahan === 3 ? total_r3 + elementPeserta.total_skor_rambahan : total_r3 + 0
                    total_r4 = elementPeserta.rambahan === 4 ? total_r4 + elementPeserta.total_skor_rambahan : total_r4 + 0
                    total_r5 = elementPeserta.rambahan === 5 ? total_r5 + elementPeserta.total_skor_rambahan : total_r5 + 0
                    total_r6 = elementPeserta.rambahan === 6 ? total_r6 + elementPeserta.total_skor_rambahan : total_r6 + 0
                    total_r7 = elementPeserta.rambahan === 7 ? total_r7 + elementPeserta.total_skor_rambahan : total_r7 + 0
                    total_r8 = elementPeserta.rambahan === 8 ? total_r8 + elementPeserta.total_skor_rambahan : total_r8 + 0
                    total_r9 = elementPeserta.rambahan === 9 ? total_r9 + elementPeserta.total_skor_rambahan : total_r9 + 0
                    total_r10 = elementPeserta.rambahan === 10 ? total_r10 + elementPeserta.total_skor_rambahan : total_r10 + 0
                });

                nodes.push({
                    collection: grupPeserta[elementTim][0].collection,
                    tim: grupPeserta[elementTim][0].tim,
                    total_r1: total_r1,
                    total_r2: total_r2,
                    total_r3: total_r3,
                    total_r4: total_r4,
                    total_r5: total_r5,
                    total_r6: total_r6,
                    total_r7: total_r7,
                    total_r8: total_r8,
                    total_r9: total_r9,
                    total_r10: total_r10,
                    total_skor: grupPeserta[elementTim].sum("total_skor_rambahan"),
                    total_skor_max1: grupPeserta[elementTim].sum("skor_max1"),
                    total_skor_max2: grupPeserta[elementTim].sum("skor_max2"),
                    total_skor_max3: grupPeserta[elementTim].sum("skor_max3"),
                })

            });

            nodes.sort((a, b) => compareFn(a, b))
            nodes.forEach((element, index) => {
                element.rank = index + 1
            });

            arrKategori.push(nodes)

            listKategori.push({ label: elementKat, value: index });
        });

        setList(listKategori);

        setListKategori(arrKategori);
    }

    const ListViewKategori = ({ kategori, nodes, selected_event }) => {
        const [isExpanded, setIsExpanded] = useState(false);

        const handleClick = () => {
            setIsExpanded(() => !isExpanded);
        };
        const current_kategori = getKategori(kategori, selected_event.kategori ? selected_event.kategori : [])

        const Item = ({ element }) => {
            return (
                <>
                    <tr key={element.collection}>
                        <td>{element.rank}</td>
                        <td>{element.tim}</td>
                        {isExpanded ?
                            <>
                                {current_kategori.max_rambahan >= 1 ?
                                    <td>{element.total_r1}</td>
                                    : null}
                                {current_kategori.max_rambahan >= 2 ?
                                    <td>{element.total_r2}</td>
                                    : null}
                                {current_kategori.max_rambahan >= 3 ?
                                    <td>{element.total_r3}</td>
                                    : null}
                                {current_kategori.max_rambahan >= 4 ?
                                    <td>{element.total_r4}</td>
                                    : null}
                                {current_kategori.max_rambahan >= 5 ?
                                    <td>{element.total_r5}</td>
                                    : null}
                                {current_kategori.max_rambahan >= 6 ?
                                    <td>{element.total_r6}</td>
                                    : null}
                                {current_kategori.max_rambahan >= 7 ?
                                    <td>{element.total_r7}</td>
                                    : null}
                                {current_kategori.max_rambahan >= 8 ?
                                    <td>{element.total_r8}</td>
                                    : null}
                                {current_kategori.max_rambahan >= 9 ?
                                    <td>{element.total_r9}</td>
                                    : null}
                                {current_kategori.max_rambahan >= 10 ?
                                    <td>{element.total_r10}</td>
                                    : null}
                            </>
                            : null}

                        <th style={{ backgroundColor: 'red' }}>{element.total_skor}</th>
                        <th style={{ backgroundColor: 'yellow' }}>{element.total_skor_max1}</th>
                        <th style={{ backgroundColor: 'yellow' }}>{element.total_skor_max2}</th>
                        <th style={{ backgroundColor: 'yellow' }}>{element.total_skor_max3}</th>

                    </tr>
                </>
            )
        }

        const exportPDF = () => {
            const unit = "pt";
            const size = "A4"; // Use A1, A2, A3 or A4
            const orientation = "portrait"; // portrait or landscape

            const marginLeft = 40;
            const doc = new jsPDF(orientation, unit, size);

            doc.setFontSize(14);

            const title = "Ranking Klub " + kategori;
            const headers = [["Ranking", "Nama Klub/Provinsi", "Total Skor", "Skor " + current_kategori.max_poin, "Skor " + (current_kategori.max_poin - 1), "Skor " + (current_kategori.max_poin - 2)]];

            const data = nodes.map(elt => [elt.rank, elt.tim, elt.total_skor, elt.total_skor_max1, elt.total_skor_max2, elt.total_skor_max3]);

            let content = {
                startY: 50,
                head: headers,
                body: data
            };

            doc.text(title, marginLeft, 40);
            doc.autoTable(content);
            doc.save("Ranking Klub " + kategori + ".pdf")
        }

        const exportExcel = () => {
            const header = ["Ranking", "Nama Klub/Provinsi", "Total Skor", "Skor " + current_kategori.max_poin, "Skor " + (current_kategori.max_poin - 1), "Skor " + (current_kategori.max_poin - 2)];
            const body = nodes.map(elt => [elt.rank, elt.tim, elt.total_skor, elt.total_skor_max1, elt.total_skor_max2, elt.total_skor_max3]);

            downloadExcel({
                fileName: "Ranking Klub " + kategori,
                sheet: "Ranking Klub " + kategori,
                tablePayload: {
                    header,
                    body: body,
                },
            })
        }

        return (
            <div className='mt-3' key={kategori}>
                <div className='d-flex flex-row p-2 bg-success align-items-center justify-content-center'>
                    <h6 className='text-white mb-0 me-auto'>Kategori {kategori}</h6>
                    {auth.user ?
                        <>
                            <button onClick={() => exportExcel()} className="btn btn-sm btn-info px-3 text-white me-2"><i className="fa fa-download"></i></button>
                            <button onClick={() => exportPDF()} className="btn btn-sm btn-info px-3 text-white me-2"><i className="fa fa-print"></i></button>
                        </>
                        : null}
                    <button onClick={handleClick} className="btn btn-sm btn-info px-3 text-white"><i className={isExpanded ? "fa fa-compress" : "fa fa-expand"}></i></button>
                </div>

                <div className="table-responsive p-2">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Ranking</th>
                                <th>Nama Klub/Provinsi</th>
                                {isExpanded ?
                                    <>
                                        {current_kategori.max_rambahan >= 1 ?
                                            <th>Total R1</th>
                                            : null}
                                        {current_kategori.max_rambahan >= 2 ?
                                            <th>Total R2</th>
                                            : null}
                                        {current_kategori.max_rambahan >= 3 ?
                                            <th>Total R3</th>
                                            : null}
                                        {current_kategori.max_rambahan >= 4 ?
                                            <th>Total R4</th>
                                            : null}
                                        {current_kategori.max_rambahan >= 5 ?
                                            <th>Total R5</th>
                                            : null}
                                        {current_kategori.max_rambahan >= 6 ?
                                            <th>Total R6</th>
                                            : null}
                                        {current_kategori.max_rambahan >= 7 ?
                                            <th>Total R7</th>
                                            : null}
                                        {current_kategori.max_rambahan >= 8 ?
                                            <th>Total R8</th>
                                            : null}
                                        {current_kategori.max_rambahan >= 9 ?
                                            <th>Total R9</th>
                                            : null}
                                        {current_kategori.max_rambahan >= 10 && current_kategori.max_rambahan < 11 ?
                                            <th>Total R10</th>
                                            : null}
                                    </>
                                    : null}

                                <th>Total Skor</th>
                                <th>Skor {current_kategori.max_poin}</th>
                                <th>Skor {current_kategori.max_poin - 1}</th>
                                <th>Skor {current_kategori.max_poin - 2}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {nodes.map((element) => (
                                <Item key={element.collection} element={element} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    function searchFilter(text) {
        setSearch(text);

        const newData = ListKategori[selectedKategori].filter(item => {
            const itemData = `${item.tim.toUpperCase()}`
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });

        setListSearch(newData);

    }

    return (
        <>
            <div className="container">
                <img className="logo-1 mt-2" src={process.env.REACT_APP_imageURL.replace('.php', '/') + selected_event.logo} />
                <h6 className='mt-2'>{selected_event.nama_event}</h6>

                <div className="mt-2">
                    <label className="form-label">Kategori</label>
                    <Select isSearchable value={[list.find(({ value }) => value === selectedKategori)]} placeholder="Pilih Kategori" options={list} onChange={(element) =>
                    (
                        setSelectedKategori(element.value),
                        setSearch('')
                    )} />
                </div>
            </div>

            {selectedKategori !== '' ?
                <>
                    <div className="input-group me-auto mx-2 mt-3" style={{ maxWidth: 300 }}>
                        <span className="input-group-text">Cari Klub/Provinsi</span>
                        <input type="text" className="form-control" value={search} onChange={(event) => searchFilter(event.target.value)} />
                    </div>

                    {search ?
                        ListSearch.length > 0 ?
                            <ListViewKategori kategori={list.find(({ value }) => value === selectedKategori).label} nodes={ListSearch} selected_event={selected_event} />
                            :
                            <h6 className='text-center text-white mt-4 bg-danger p-3'>Data tidak ditemukan</h6>
                        :
                        <ListViewKategori kategori={list.find(({ value }) => value === selectedKategori).label} nodes={ListKategori[selectedKategori]} selected_event={selected_event} />

                    }
                </>
                : null}
        </>
    )
}

export default RankingTim