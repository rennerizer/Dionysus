﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WorldCities.Data
{
    public class CityDTO
    {
        public int      Id          { get; set; }

        public string   Name        { get; set; }

        public string   Name_ASCII  { get; set; }

        public decimal  Lat         { get; set; }

        public decimal  Lon         { get; set; }

        public int      CountryId   { get; set; }

        public string   CountryName { get; set; }

        public CityDTO() { }
    }
}
