/* global window */
/**
 * STM - DealerInformation
 **/

import React, { PropTypes, PureComponent } from 'react';
import classnames from 'classnames';

import Icon from 'components/UCM/Icon';

import Button from 'components/UCX/Button';
import Image from 'components/UCM/Image';

import ModalWindow from 'components/UCL/ModalWindow';

import ImageDescription from 'components/UCT/ImageDescription';

import { formatPhoneNumber } from 'utils/string';

import './styles';

class DealerInformation extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            CFADModalOpen: {
                isOpen: false
            }
        };
    }

    static className = 'fad-dealer-information';

    componentWillMount() {
    }

    componentDidMount() {
    }

    componentWillReceiveProps(/* nextProps */) {
    }

    componentWillUpdate(/* nextProps, nextState */) {
    }

    componentDidUpdate(/* prevProps, prevState */) {
    }

    componentWillUnmount() {
    }

    _CFADLearnMore = () => {
        this.setState({CFADModalOpen: {isOpen: true}});

        window.DATALAYER.linkTrack(false, {
            lpos: 'dealer-locator',
            lid: 'cfad-learn-more',
            linkType: 'func'
        });
    };

    _onCFADModalClose = () => {
        this.setState({CFADModalOpen: {isOpen: false}});

        window.DATALAYER.linkTrack(false, {
            lpos: 'cfad-modal-window',
            lid: 'close'
        });
    };

    _handleDealerSite = (e) => {
        e.preventDefault();

        const {dealerSite} = this.props;

        let {href} = dealerSite;

        if (href.indexOf('http') === -1) {
            href = 'http://' + href;
        }

        window.open(href);
    };

    _onClickHeadingHandle = (e) => {
        e.preventDefault();

        const {onHeadingClick} = this.props;

        if (typeof onHeadingClick === 'function') {
            onHeadingClick(e);
        }
    };

    _clickPhoneNumber = (e) => {
        e.preventDefault();

        window.DATALAYER.linkTrack(false, {
            lpos: 'content',
            lid: 'click_to_call',
            linkType: 'func'
        });

        const {phoneNumber} = this.props;

        window.location = 'tel:' + phoneNumber;
    };

    render() {
        const {
            constructor,
            props,
            state
        } = this;

        const thisClassName = constructor.className;

        const {
            address,
            CFAD,
            className,
            dealershipName,
            dealerSite,
            distanceAway,
            distanceFocusedData,
            headingState,
            hoursOfOperation,
            id,
            phoneNumber,
            salesHoursHTML,
            serviceHoursHTML,
            text,
            theme,
            variation
        } = props;

        const {CFADModalOpen} = state;

        const formattedNumber = formatPhoneNumber(phoneNumber, 0, 3, 6);

        const informationType = variation === 'full' || variation === 'simplified';

        const showLearnMoreButton = variation === 'full' || variation === 'simplified' ? dealerSite : variation === 'distanceFocused' ? distanceFocusedData.dealerSite : null;

        const dealerSiteData = variation === 'full' ? dealerSite : variation === 'distanceFocused' ? distanceFocusedData.dealerSite : null;

        const attributes = {
            id,
            'className': classnames(thisClassName, className, `gcss-theme-${theme}`),
            'data-information-type': informationType,
            'data-variation': variation
        };

        let CFADurl = '';

        if (dealerSiteData) {
            CFADurl = dealerSiteData.href;

            if (CFADurl.indexOf('http') === -1) {
                CFADurl = 'http://' + CFADurl + '/customer-first.htm';
            }
        }

        const CFADescriptionBlock = {
            title: 'Awarded For Excellent Customer Service',
            titleStyle: 'gcss-typography-brand-heading-4',
            contentModules: [
                {
                    type: 'paragraphCopy',
                    content: {
                        paragraphCopy: 'This Dealer Has Achieved the Highest Level of Customer Experience Recognition in Five Core Areas: People, Facility, Processes, Customer Metrics and Training Certification.'
                    }
                }
            ],
            buttons: [
                {
                    priority: 'tertiary',
                    href: CFADurl,
                    icon: 'icon',
                    width: 'variable',
                    target: '_blank',
                    lid: 'customer-first-award-learn_more',
                    lpos: 'dealer-locator-modalwindow',
                    linkType: 'exit',
                    children: 'Learn More'
                }
            ]
        };

        const CFADisplayMedia = {
            mediaType: 'image',
            media: {
                mediaAsset: {
                    image: {
                        alt: 'Customer First Award for Excellence',
                        xs: '/content/dam/fca-brands/na/shoppingtools/Customer_First_Logo.png',
                        sm: '/content/dam/fca-brands/na/shoppingtools/Customer_First_Logo.png',
                        md: '/content/dam/fca-brands/na/shoppingtools/Customer_First_Logo.png',
                        lg: '/content/dam/fca-brands/na/shoppingtools/Customer_First_Logo.png'
                    }
                }
            }
        };

        return (
            <div
                {...attributes}
            >
                <div className={`${thisClassName}-wrapper`}>
                    {informationType &&
                    (
                        <div className={`${thisClassName}-common`}>
                            <a
                                className={classnames('link', 'link-text', `${thisClassName}-dealership-name`)}
                                data-lid={headingState && headingState.lid ? headingState.lid : ''}
                                data-lpos={headingState && headingState.lpos ? headingState.lpos : ''}
                                data-adobe-linktype="func"
                                href="#"
                                role="link"
                                target="_self"
                                onClick={this._onClickHeadingHandle}
                            >
                                <div className={`${thisClassName}-common-dealership-name`}>{dealershipName}</div>
                                {distanceAway !== '' && (
                                    <div className={`${thisClassName}-common-distance-away`}>{distanceAway} miles
                                        away</div>)
                                }
                            </a>
                            {CFAD &&
                            (
                                <div className={`${thisClassName}-cfad`}>
                                    <Image
                                        alt="Customer First Award for Excellence"
                                        xs="/content/dam/fca-brands/na/shoppingtools/Customer_First_Logo_small.png"
                                        sm="/content/dam/fca-brands/na/shoppingtools/Customer_First_Logo_small.png"
                                        md="/content/dam/fca-brands/na/shoppingtools/Customer_First_Logo_small.png"
                                        lg="/content/dam/fca-brands/na/shoppingtools/Customer_First_Logo_small.png"
                                        isLazy={false}
                                    />

                                    {showLearnMoreButton && (
                                        <Button
                                            priority="tertiary"
                                            icon="info-circle"
                                            plain
                                            onClick={this._CFADLearnMore}
                                            children="Learn More"
                                        />
                                    )}
                                </div>
                            )
                            }
                        </div>
                    )
                    }

                    <div className={classnames('print-element', 'print-main-wrapper')}>
                        <div className={'print-address'}>
                            <div className={`${thisClassName}-address`}>{address}</div>
                            <div className={`${thisClassName}-phone-number`}>{formattedNumber}</div>
                        </div>
                        <div className={'print-sales-hours'}>
                            {salesHoursHTML}
                        </div>
                        <div className={'print-service-hours'}>
                            {serviceHoursHTML}
                        </div>
                    </div>

                    {variation === 'full' &&
                    (
                        <div className={`${thisClassName}-variation-full-wrapper`}>
                            <div className={`${thisClassName}-address`}>{address}</div>
                            <Button
                                onClick={this._clickPhoneNumber}
                                url="#"
                                priority="tertiary"
                                plain
                                className={`${thisClassName}-phone-number`}
                                children={formattedNumber}
                            />
                            <div className={`${thisClassName}-text-details`}>
                                <span className={`${thisClassName}-text`}>{text}</span>
                                <span
                                    className={classnames(`${thisClassName}-hours-of-operation`, 'gcss-typography-label-2')}>{hoursOfOperation}</span>
                            </div>
                        </div>
                    )
                    }

                    {!informationType &&
                    (
                        <div className={`${thisClassName}-distance-focused`}>
                            <Icon
                                icon={distanceFocusedData.icon}
                                className={`${thisClassName}-distance-focused-icon`}
                            />
                            <div className={`${thisClassName}-distance-focused-text-details`}>
                                <span
                                    className={`${thisClassName}-text-details-number`}>{distanceFocusedData.number}</span>
                                <span className={`${thisClassName}-text-details-text`}>{distanceFocusedData.text}</span>
                            </div>
                        </div>
                    )
                    }

                    {((variation === 'full' || variation === 'distanceFocused') && dealerSiteData) &&
                    (<Button
                        {...dealerSiteData}
                        theme={theme}
                        className={`${thisClassName}-dealer-site`}
                        onClick={this._handleDealerSite}
                    />)}

                    {CFADModalOpen.isOpen &&
                    (<ModalWindow {...this.state.CFADModalOpen} onClose={this._onCFADModalClose}>
                        <div className={`${thisClassName}-CFAD-modal`}>
                            <ImageDescription
                                displayMedia={CFADisplayMedia}
                                descriptionBlock={CFADescriptionBlock}
                                division="40-60"
                            />
                        </div>
                    </ModalWindow>)}
                </div>
            </div>
        );
    }
}

DealerInformation.propTypes = {
    address: PropTypes.string,
    className: PropTypes.string,
    dealerSite: PropTypes.shape({Button}.propTypes),
    dealershipName: PropTypes.string,
    distanceAway: PropTypes.string,
    distanceFocusedData: PropTypes.shape({
        icon: PropTypes.string,
        number: PropTypes.string,
        text: PropTypes.string,
        dealerSite: PropTypes.shape({Button}.propTypes)
    }),
    headingState: PropTypes.shape({
        lid: PropTypes.string,
        lpos: PropTypes.string
    }),
    hoursOfOperation: PropTypes.string,
    id: PropTypes.string,
    onDealerSite: PropTypes.func,
    onHeadingClick: PropTypes.func,
    phoneNumber: PropTypes.string,
    text: PropTypes.string,
    theme: PropTypes.oneOf(['dark', 'light']),
    variation: PropTypes.oneOf(['full', 'simplified', 'distanceFocused'])
};

DealerInformation.defaultProps = {
    theme: 'light'
};

export default DealerInformation;
