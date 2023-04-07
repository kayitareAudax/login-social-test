import styled from 'styled-components'
import ReactCodeInput from 'react-code-input'

const StyledReactInputVerificationCode = styled.div`
    display: flex;
    justify-content: center;
    --ReactInputVerificationCode-itemWidth: 40px;
    --ReactInputVerificationCode-itemHeight: 48px;
    --ReactInputVerificationCode-itemSpacing: 8px;
    .ReactInputVerificationCode__item {
        font-size: 16px;
        font-weight: 500;
        color: rgb(0, 0, 0);
        background-color: #ffffff;
        border: 1px solid #bebebe;
        border-radius: 4px;
        box-shadow: none;
    }
    .ReactInputVerificationCode__item.is-active {
        box-shadow: none;
        border: 1px solid #36c6d9;
    }
`

type CodeVerificationProps = {
    verificationCode: string
    setVerificationCode(val: string): void
}

const CodeVerification = ({
    verificationCode,
    setVerificationCode,
}: CodeVerificationProps) => {
    return (
        <StyledReactInputVerificationCode>
            <ReactCodeInput
                type="text"
                fields={6}
                name={''}
                inputMode={'tel'}
                value={verificationCode}
                onChange={(val) => setVerificationCode(val)}
            />
        </StyledReactInputVerificationCode>
    )
}

export default CodeVerification
