import { useEffect } from 'react'
import { useState } from 'react'
import './App.css'
const apiKey = import.meta.env.VITE_IMDB_API_KEY

function App() {
	const [selectVal, setSelectVal] = useState('')
	const [inputVal, setInputVal] = useState('')
	const [dataIds, setDataIds] = useState(null)
	const [data, setData] = useState(null)

	useEffect(() => {
		async function fetchData() {
			const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=Harry Potter`)
			const resData = await res.json()
			if (resData) {
				const dataIds = resData.Search.filter((d, id) => id < 10).reduce((acc, el) => {
					acc.push(el.imdbID)
					return acc
				}, [])
				setDataIds(dataIds)
			}
		}

		fetchData()
	}, [])

	useEffect(() => {
		if (dataIds) {
			const setDataFun = async () => {
				const newData = []
				for (const el of dataIds) {
					const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${el}`)
					const resData = await res.json()
					if (resData) {
						newData.push(resData)
					}
				}

				setData(newData)
			}

			setDataFun()
		}
	}, [dataIds])

	return (
		<div className='container d-flex flex-column gap-4'>
			<div className='d-flex justify-between gap-4'>
				<input
					value={inputVal}
					className='w-50 min-w-200px'
					type='text'
					placeholder='Wprowadź tytuł lub id'
					onChange={e => setInputVal(e.target.value)}
				/>
				<select value={selectVal} name='select' id='selectID' onChange={e => setSelectVal(e.target.value)}>
					<option value='film'>Film</option>
					<option value='serial'>Serial</option>
					<option value='epizod'>Epizod</option>
				</select>
			</div>
			<table>
				<thead className='text-uppercase'>
					<tr>
						<td>Tytuł</td>
						<td width={'15%'}>Rok</td>
						<td width={'20%'}>Typ produkcji</td>
						<td width={'25%'}>Kraj</td>
					</tr>
				</thead>
				<tbody>
					{data ? (
						data.map((el, id) => {
							return (
								<tr key={id}>
									<td>{el.Title}</td>
									<td>{el.Year}</td>
									<td>{el.Type}</td>
									<td>{el.Country}</td>
								</tr>
							)
						})
					) : (
						<tr>
							<td colSpan={4}>Błąd pobierania danych!</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	)
}

export default App
