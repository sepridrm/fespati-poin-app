
export default function ListArrow({ skor, updateSkor, kategori }) {
    const arrowList = [];

    for (let a = 0; a < parseInt(kategori.max_arrow); a++) {
        arrowList.push(
            <div key={"arrow-" + a} className="d-flex flex-column align-items-center justifi-content-center">
                <label className="form-label">Arrow {a + 1}</label>
                <nav className="table-responsive mx-3">
                    <ul className="pagination pagination-md">
                        {kategori.max_poin >= 1 ?
                            <>
                                <li className={skor[a].skor === 0 ? "page-item active" : "page-item"} onClick={() => updateSkor(a, 0)}><a className="page-link">0</a></li>
                                <li className={skor[a].skor === 1 ? "page-item active" : "page-item"} onClick={() => updateSkor(a, 1)}><a className="page-link">1</a></li>
                            </> : null}
                        {kategori.max_poin >= 2 ?
                            <li className={skor[a].skor === 2 ? "page-item active" : "page-item"} onClick={() => updateSkor(a, 2)}><a className="page-link">2</a></li>
                            : null}
                        {kategori.max_poin >= 3 ?
                            <li className={skor[a].skor === 3 ? "page-item active" : "page-item"} onClick={() => updateSkor(a, 3)}><a className="page-link">3</a></li>
                            : null}
                        {kategori.max_poin >= 4 ?
                            <li className={skor[a].skor === 4 ? "page-item active" : "page-item"} onClick={() => updateSkor(a, 4)}><a className="page-link">4</a></li>
                            : null}
                        {kategori.max_poin >= 5 ?
                            <li className={skor[a].skor === 5 ? "page-item active" : "page-item"} onClick={() => updateSkor(a, 5)}><a className="page-link">5</a></li>
                            : null}
                        {kategori.max_poin >= 6 ?
                            <li className={skor[a].skor === 6 ? "page-item active" : "page-item"} onClick={() => updateSkor(a, 6)}><a className="page-link">6</a></li>
                            : null}
                        {kategori.max_poin >= 7 ?
                            <li className={skor[a].skor === 7 ? "page-item active" : "page-item"} onClick={() => updateSkor(a, 7)}><a className="page-link">7</a></li>
                            : null}
                        {kategori.max_poin >= 8 ?
                            <li className={skor[a].skor === 8 ? "page-item active" : "page-item"} onClick={() => updateSkor(a, 8)}><a className="page-link">8</a></li>
                            : null}
                        {kategori.max_poin >= 9 ?
                            <li className={skor[a].skor === 9 ? "page-item active" : "page-item"} onClick={() => updateSkor(a, 9)}><a className="page-link">9</a></li>
                            : null}
                        {kategori.max_poin >= 10 && kategori.max_poin < 11 ?
                            <li className={skor[a].skor === 10 ? "page-item active" : "page-item"} onClick={() => updateSkor(a, 10)}><a className="page-link">10</a></li>
                            : null}
                    </ul>
                </nav>
            </div>
        )
    }

    return arrowList;

    (
        <>
            <div className={"mt-4"}>
                <label className="form-label">Arrow 1</label>
                <nav className="table-responsive mx-3">
                    <ul className="pagination pagination-md">
                        <li className={skor[0].skor === 0 ? "page-item active" : "page-item"} onClick={() => updateSkor(0, 0)}><a className="page-link">0</a></li>
                        <li className={skor[0].skor === 1 ? "page-item active" : "page-item"} onClick={() => updateSkor(0, 1)}><a className="page-link">1</a></li>
                        <li className={skor[0].skor === 2 ? "page-item active" : "page-item"} onClick={() => updateSkor(0, 2)}><a className="page-link">2</a></li>
                        <li className={skor[0].skor === 3 ? "page-item active" : "page-item"} onClick={() => updateSkor(0, 3)}><a className="page-link">3</a></li>
                        <li className={skor[0].skor === 4 ? "page-item active" : "page-item"} onClick={() => updateSkor(0, 4)}><a className="page-link">4</a></li>
                        <li className={skor[0].skor === 5 ? "page-item active" : "page-item"} onClick={() => updateSkor(0, 5)}><a className="page-link">5</a></li>
                        <li className={skor[0].skor === 6 ? "page-item active" : "page-item"} onClick={() => updateSkor(0, 6)}><a className="page-link">6</a></li>
                    </ul>
                </nav>
            </div>
            <div className={"mt-2"}>
                <label className="form-label">Arrow 2</label>
                <nav className="table-responsive mx-3">
                    <ul className="pagination pagination-md">
                        <li className={skor[1].skor === 0 ? "page-item active" : "page-item"} onClick={() => updateSkor(1, 0)}><a className="page-link">0</a></li>
                        <li className={skor[1].skor === 1 ? "page-item active" : "page-item"} onClick={() => updateSkor(1, 1)}><a className="page-link">1</a></li>
                        <li className={skor[1].skor === 2 ? "page-item active" : "page-item"} onClick={() => updateSkor(1, 2)}><a className="page-link">2</a></li>
                        <li className={skor[1].skor === 3 ? "page-item active" : "page-item"} onClick={() => updateSkor(1, 3)}><a className="page-link">3</a></li>
                        <li className={skor[1].skor === 4 ? "page-item active" : "page-item"} onClick={() => updateSkor(1, 4)}><a className="page-link">4</a></li>
                        <li className={skor[1].skor === 5 ? "page-item active" : "page-item"} onClick={() => updateSkor(1, 5)}><a className="page-link">5</a></li>
                        <li className={skor[1].skor === 6 ? "page-item active" : "page-item"} onClick={() => updateSkor(1, 6)}><a className="page-link">6</a></li>
                    </ul>
                </nav>
            </div>
            <div className={"mt-2"}>
                <label className="form-label">Arrow 3</label>
                <nav className="table-responsive mx-3">
                    <ul className="pagination pagination-md">
                        <li className={skor[2].skor === 0 ? "page-item active" : "page-item"} onClick={() => updateSkor(2, 0)}><a className="page-link">0</a></li>
                        <li className={skor[2].skor === 1 ? "page-item active" : "page-item"} onClick={() => updateSkor(2, 1)}><a className="page-link">1</a></li>
                        <li className={skor[2].skor === 2 ? "page-item active" : "page-item"} onClick={() => updateSkor(2, 2)}><a className="page-link">2</a></li>
                        <li className={skor[2].skor === 3 ? "page-item active" : "page-item"} onClick={() => updateSkor(2, 3)}><a className="page-link">3</a></li>
                        <li className={skor[2].skor === 4 ? "page-item active" : "page-item"} onClick={() => updateSkor(2, 4)}><a className="page-link">4</a></li>
                        <li className={skor[2].skor === 5 ? "page-item active" : "page-item"} onClick={() => updateSkor(2, 5)}><a className="page-link">5</a></li>
                        <li className={skor[2].skor === 6 ? "page-item active" : "page-item"} onClick={() => updateSkor(2, 6)}><a className="page-link">6</a></li>
                    </ul>
                </nav>
            </div>
            <div className={"mt-2"}>
                <label className="form-label">Arrow 4</label>
                <nav className="table-responsive mx-3">
                    <ul className="pagination pagination-md">
                        <li className={skor[3].skor === 0 ? "page-item active" : "page-item"} onClick={() => updateSkor(3, 0)}><a className="page-link">0</a></li>
                        <li className={skor[3].skor === 1 ? "page-item active" : "page-item"} onClick={() => updateSkor(3, 1)}><a className="page-link">1</a></li>
                        <li className={skor[3].skor === 2 ? "page-item active" : "page-item"} onClick={() => updateSkor(3, 2)}><a className="page-link">2</a></li>
                        <li className={skor[3].skor === 3 ? "page-item active" : "page-item"} onClick={() => updateSkor(3, 3)}><a className="page-link">3</a></li>
                        <li className={skor[3].skor === 4 ? "page-item active" : "page-item"} onClick={() => updateSkor(3, 4)}><a className="page-link">4</a></li>
                        <li className={skor[3].skor === 5 ? "page-item active" : "page-item"} onClick={() => updateSkor(3, 5)}><a className="page-link">5</a></li>
                        <li className={skor[3].skor === 6 ? "page-item active" : "page-item"} onClick={() => updateSkor(3, 6)}><a className="page-link">6</a></li>
                    </ul>
                </nav>
            </div>
            <div className={"mt-2"}>
                <label className="form-label">Arrow 5</label>
                <nav className="table-responsive mx-3">
                    <ul className="pagination pagination-md">
                        <li className={skor[4].skor === 0 ? "page-item active" : "page-item"} onClick={() => updateSkor(4, 0)}><a className="page-link">0</a></li>
                        <li className={skor[4].skor === 1 ? "page-item active" : "page-item"} onClick={() => updateSkor(4, 1)}><a className="page-link">1</a></li>
                        <li className={skor[4].skor === 2 ? "page-item active" : "page-item"} onClick={() => updateSkor(4, 2)}><a className="page-link">2</a></li>
                        <li className={skor[4].skor === 3 ? "page-item active" : "page-item"} onClick={() => updateSkor(4, 3)}><a className="page-link">3</a></li>
                        <li className={skor[4].skor === 4 ? "page-item active" : "page-item"} onClick={() => updateSkor(4, 4)}><a className="page-link">4</a></li>
                        <li className={skor[4].skor === 5 ? "page-item active" : "page-item"} onClick={() => updateSkor(4, 5)}><a className="page-link">5</a></li>
                        <li className={skor[4].skor === 6 ? "page-item active" : "page-item"} onClick={() => updateSkor(4, 6)}><a className="page-link">6</a></li>
                    </ul>
                </nav>
            </div>
            <div className={"mt-2"}>
                <label className="form-label">Arrow 6</label>
                <nav className="table-responsive mx-3">
                    <ul className="pagination pagination-md">
                        <li className={skor[5].skor === 0 ? "page-item active" : "page-item"} onClick={() => updateSkor(5, 0)}><a className="page-link">0</a></li>
                        <li className={skor[5].skor === 1 ? "page-item active" : "page-item"} onClick={() => updateSkor(5, 1)}><a className="page-link">1</a></li>
                        <li className={skor[5].skor === 2 ? "page-item active" : "page-item"} onClick={() => updateSkor(5, 2)}><a className="page-link">2</a></li>
                        <li className={skor[5].skor === 3 ? "page-item active" : "page-item"} onClick={() => updateSkor(5, 3)}><a className="page-link">3</a></li>
                        <li className={skor[5].skor === 4 ? "page-item active" : "page-item"} onClick={() => updateSkor(5, 4)}><a className="page-link">4</a></li>
                        <li className={skor[5].skor === 5 ? "page-item active" : "page-item"} onClick={() => updateSkor(5, 5)}><a className="page-link">5</a></li>
                        <li className={skor[5].skor === 6 ? "page-item active" : "page-item"} onClick={() => updateSkor(5, 6)}><a className="page-link">6</a></li>
                    </ul>
                </nav>
            </div>
            <div className={"mt-2"}>
                <label className="form-label">Arrow 7</label>
                <nav className="table-responsive mx-3">
                    <ul className="pagination pagination-md">
                        <li className={skor[6].skor === 0 ? "page-item active" : "page-item"} onClick={() => updateSkor(6, 0)}><a className="page-link">0</a></li>
                        <li className={skor[6].skor === 1 ? "page-item active" : "page-item"} onClick={() => updateSkor(6, 1)}><a className="page-link">1</a></li>
                        <li className={skor[6].skor === 2 ? "page-item active" : "page-item"} onClick={() => updateSkor(6, 2)}><a className="page-link">2</a></li>
                        <li className={skor[6].skor === 3 ? "page-item active" : "page-item"} onClick={() => updateSkor(6, 3)}><a className="page-link">3</a></li>
                        <li className={skor[6].skor === 4 ? "page-item active" : "page-item"} onClick={() => updateSkor(6, 4)}><a className="page-link">4</a></li>
                        <li className={skor[6].skor === 5 ? "page-item active" : "page-item"} onClick={() => updateSkor(6, 5)}><a className="page-link">5</a></li>
                        <li className={skor[6].skor === 6 ? "page-item active" : "page-item"} onClick={() => updateSkor(6, 6)}><a className="page-link">6</a></li>
                    </ul>
                </nav>
            </div>
        </>
    )
}