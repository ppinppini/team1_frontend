import { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import styled from "styled-components";

export default function Main() {
  const [info, setInfo] = useState();
  const [markers, setMarkers] = useState([]);
  const [map, setMap] = useState();
  const [value, setValue] = useState("");
  const [keyword, setKeyword] = useState("명지대학교 인문캠퍼스");
  const [result, setResult] = useState([]);

  useEffect(() => {
    if (!map) return;
    const ps = new window.kakao.maps.services.Places();

    ps.keywordSearch(keyword, (data, status, _pagination) => {
      if (keyword !== "명지대학교 인문캠퍼스") {
        setResult(data);
      }
      if (status === window.kakao.maps.services.Status.OK) {
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        const bounds = new window.kakao.maps.LatLngBounds();
        let markers = [];

        for (let i = 0; i < data.length; i++) {
          markers.push({
            position: {
              lat: data[i].y,
              lng: data[i].x,
            },
            content: data[i].place_name,
          });
          bounds.extend(new window.kakao.maps.LatLng(data[i].y, data[i].x));
        }
        setMarkers(markers);

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        map.setBounds(bounds);
      }
    });
  }, [map, keyword]);

  return (
    <>
      <Map // 로드뷰를 표시할 Container
        center={{
          lat: 37.566826,
          lng: 126.9786567,
        }}
        style={{
          width: "100%",
          height: "50vw",
        }}
        level={3}
        onCreate={setMap}
      >
        {markers.map((marker) => (
          <MapMarker
            key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
            position={marker.position}
            onClick={() => setInfo(marker)}
          >
            {info && info.content === marker.content && (
              <div style={{ color: "#000" }}>{marker.content}</div>
            )}
          </MapMarker>
        ))}
      </Map>
      <FindInput
        value={value}
        onChange={(e) => {
          console.log(e.target.value);
          setValue(e.target.value);
        }}
      />
      <FindButton
        onClick={() => {
          setKeyword(value);
        }}
      >
        검색
      </FindButton>
      <ResultUl>
        {result.map((r, i) => {
          console.log(r);
          return (
            <ResultLi key={i}>
              상호명: {r.place_name}
              <br />
              지역: {r.address_name}
            </ResultLi>
          );
        })}
      </ResultUl>
    </>
  );
}

const FindInput = styled.input``;
const FindButton = styled.button``;
const ResultUl = styled.ul`
  padding: 0;
`;
const ResultLi = styled.li`
  border: 1px solid black;
  margin-bottom: 10px;
  list-style: none;
`;
