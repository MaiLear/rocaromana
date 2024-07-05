"use client"
import React, { useEffect, useState } from 'react'
import Breadcrumb from "@/Components/Breadcrumb/Breadcrumb";
import Skeleton from "react-loading-skeleton";
import { GetCountByCitysApi } from "@/store/actions/campaign";
import Link from "next/link";
import { placeholderImage, translate } from "@/utils";
import { useSelector } from "react-redux";
import { languageData } from "@/store/reducer/languageSlice";
import Image from "next/image";
import NoData from "@/Components/NoDataFound/NoData";
import Layout from '../Layout/Layout';

const NearBycity = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [getNearByCitysData, setGetNearByCitysData] = useState([]); // Initialize as null
    const [offsetdata, setOffsetdata] = useState(0);
    const [hasMoreData, setHasMoreData] = useState(true); // Track if there's more data to load

    const limit = 8;

    useEffect(() => {
        setIsLoading(true);

        GetCountByCitysApi({
            offset: offsetdata.toString(),
            limit: limit.toString(),
            onSuccess: (response) => {
                setIsLoading(false);
                const cityData = response.data;
                setGetNearByCitysData(prevData => [...prevData, ...cityData]);
                setHasMoreData(cityData.length === limit);
            },
            onError: (error) => {
                console.log(error);
            }
        }
        );
    }, [offsetdata]);
    const lang = useSelector(languageData);

    useEffect(() => { }, [lang]);
    const handleLoadMore = () => {
        const newOffset = offsetdata + limit;
        setOffsetdata(newOffset);
    };
    return (
        <Layout>
            <Breadcrumb title={translate("propNearByCities")} />
            <section id="all-nearby-citys">
                {isLoading ? (
                    <div className="container">
                        <div className="all-city-images row">
                            {Array.from({ length: getNearByCitysData ? getNearByCitysData.length : 12 }).map((_, index) => (
                                <div className="col-sm-12 col-md-6 col-lg-3 loading_data" key={index}>
                                    <Skeleton width="100%" height="350px" />
                                </div>
                            ))}
                        </div>
                    </div>      
                ) : getNearByCitysData && getNearByCitysData.length > 0 ? (
                    <div className="container">
                        <div className="all-city-images row">
                            {getNearByCitysData.map((ele, index) => (
                                <div className="col-12 col-md-6 col-lg-3" key={index}>
                                    <Link href={`/properties/city/${ele.City}`}>
                                        <div className="card bg-dark text white mb-3" id="nearby-city-img">
                                            <Image loading="lazy" src={ele.image} className="card-img" alt="no_img" id="city-img" width={200} height={200} onError={placeholderImage} />
                                            <div className="card-img-overlay">
                                                <div id="city_img_headlines">
                                                    <h4
                                                        className="card-title">{ele.City}</h4>
                                                    <p className="card-text">
                                                        {ele.Count} {translate("properties")}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                        {getNearByCitysData && getNearByCitysData.length > 0 && hasMoreData ? (
                            <div className="col-12 loadMoreDiv" id="loadMoreDiv">
                                <button className='loadMore' onClick={handleLoadMore}>{translate("loadmore")}</button>
                            </div>
                        ) : null}
                    </div>
                ) : (
                    <div className="noDataFoundDiv">
                        <NoData />
                    </div>
                )}
            </section>
        </Layout>
    )
}

export default NearBycity
