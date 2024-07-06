import React, { useEffect, useState } from 'react'
import Breadcrumb from "@/Components/Breadcrumb/Breadcrumb";
import { GetFeturedListingsApi } from "@/store/actions/campaign";
import Link from "next/link";
import VerticalCard from "@/Components/Cards/VerticleCard";
import VerticalCardSkeleton from "@/Components/Skeleton/VerticalCardSkeleton";
import { useSelector } from "react-redux";
import { translate } from "@/utils";
import { languageData } from "@/store/reducer/languageSlice";
import NoData from "@/Components/NoDataFound/NoData";
import Layout from '../Layout/Layout';

const FeaturedProperty = () => {
    const lang = useSelector(languageData);

    useEffect(() => { }, [lang]);
    const [isLoading, setIsLoading] = useState(true);
    const [getFeaturedListing, setGetFeaturedListing] = useState([]);
    const [total, setTotal] = useState(0);
    const [offsetdata, setOffsetdata] = useState(0);
    const [hasMoreData, setHasMoreData] = useState(true); // Track if there's more data to load

    const limit = 8;
    const isLoggedIn = useSelector((state) => state.User_signup);
    const userCurrentId = isLoggedIn && isLoggedIn.data ? isLoggedIn.data.data.id : null;

    useEffect(() => {
        setIsLoading(true);
        GetFeturedListingsApi({
            promoted: "1",
            offset: offsetdata.toString(),
            limit: limit.toString(),
            onSuccess: (response) => {
                setTotal(response.total);
                const FeaturedListingData = response.data;
                setIsLoading(false);
                setGetFeaturedListing(prevListings => [...prevListings, ...FeaturedListingData]);
                setHasMoreData(FeaturedListingData.length === limit);
            },
            onError: (error) => {
                setIsLoading(true);
                console.log(error);
            }
        });
    }, [offsetdata, isLoggedIn]);

    const handleLoadMore = () => {
        const newOffset = offsetdata + limit;
        setOffsetdata(newOffset);
    };

    return (
        <Layout>
            <Breadcrumb title={translate("featurdAllProp")} />
            <section id="featured_prop_section">
                <div className="container">
                    <div id="feature_cards" className="row">
                        {isLoading ? ( // Show Skeleton when isLoading is true
                            Array.from({ length: 8 }).map((_, index) => (
                                <div className="col-sm-12 col-md-6 col-lg-3 loading_data" key={index}>
                                    <VerticalCardSkeleton />
                                </div>
                            ))
                        ) : getFeaturedListing.length > 0 ? (
                            getFeaturedListing.map((ele, index) => (
                                <div className="col-sm-12 col-md-6 col-lg-6 col-xl-4 col-xxl-3" key={index}>
                                    <Link href={`/properties-details/${ele.slug_id}`} >
                                        <VerticalCard ele={ele} />
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="noDataFoundDiv">
                                <NoData />
                            </div>
                        )}
                        {getFeaturedListing && getFeaturedListing.length > 0 && hasMoreData ? (
                            <div className="col-12 loadMoreDiv" id="loadMoreDiv">
                                <button className='loadMore' onClick={handleLoadMore}>{translate("loadmore")}</button>
                            </div>
                        ) : null}
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default FeaturedProperty;
