import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

const SelectAddress = ({setAddress}) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get('https://vapi.vnappmob.com/api/province/');
        setProvinces(
          response.data.results.map((province) => ({
            value: province.province_id,
            label: province.province_name,
          }))
        );
      } catch (error) {
        console.error('Lỗi khi lấy danh sách tỉnh/thành phố:', error);
      }
    };

    fetchProvinces();
  }, []);

  const handleProvinceChange = async (option) => {
    setSelectedProvince(option);
    setAddress("city",option.label)
    try {
      const response = await axios.get(`https://vapi.vnappmob.com/api/province/district/${option.value}`);
      setDistricts(
        response.data.results.map((district) => ({
          value: district.district_id,
          label: district.district_name,
        }))
      );
      setSelectedDistrict(null);
      setSelectedWard(null);
      setWards([]);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách quận/huyện:', error);
    }
  };

  const handleDistrictChange = async (option) => {
    setSelectedDistrict(option);
    setAddress("district",option.label)
    try {
      const response = await axios.get(`https://vapi.vnappmob.com/api/province/ward/${option.value}`);
      setWards(
        response.data.results.map((ward) => ({
          value: ward.ward_id,
          label: ward.ward_name,
        }))
      );
      setSelectedWard(null);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách xã/phường:', error);
    }
  };

  const handleWardChange = (option) => {
    setSelectedWard(option);
    setAddress("ward",option.label)
  };

  return (
    <div>
      <h2>Địa chỉ</h2>
      <div>
        <label htmlFor="province">Tỉnh/Thành phố:</label>
        <Select
          id="province"
          name="city"
          value={selectedProvince}
          onChange={handleProvinceChange}
          options={provinces}
          placeholder="Chọn Tỉnh/Thành phố"
        />
      </div>
      <div>
        <label htmlFor="district">Quận/Huyện:</label>
        <Select
          name="district"
          id="district"
          value={selectedDistrict}
          onChange={handleDistrictChange}
          options={districts}
          placeholder="Chọn Quận/Huyện"
        />
      </div>
      <div>
        <label htmlFor="ward">Xã/Phường:</label>
        <Select
          name="ward"
          id="ward"
          value={selectedWard}
          onChange={handleWardChange}
          options={wards}
          placeholder="Chọn Xã/Phường"
        />
      </div>
    </div>
  );
};

export default SelectAddress;